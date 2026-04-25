type AuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

type AuthSession = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_at?: number;
  user: AuthUser;
};

type AuthCallback = (event: string, session: AuthSession | null) => void;

type QueryState = {
  table: string;
  select?: string;
  orderColumn?: string;
  ascending?: boolean;
  limitCount?: number;
  filters: Array<{ column: string; value: string }>;
  single?: "maybe";
};

const STORAGE_KEY = "bridge2.auth.session";
const authSubscribers = new Set<AuthCallback>();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function setStoredSession(session: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(STORAGE_KEY);
  authSubscribers.forEach((callback) => callback(session ? "SIGNED_IN" : "SIGNED_OUT", session));
}

function authHeaders() {
  const session = getStoredSession();
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${session?.access_token ?? supabaseKey}`,
    "Content-Type": "application/json",
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.msg || data?.message || data?.error_description || data?.error || "Request failed";
    throw new Error(message);
  }

  return data as T;
}

function createTableQuery(state: QueryState) {
  const runSelect = async () => {
    const params = new URLSearchParams();
    params.set("select", state.select ?? "*");
    state.filters.forEach((filter) => params.set(filter.column, `eq.${filter.value}`));
    if (state.orderColumn) params.set("order", `${state.orderColumn}.${state.ascending === false ? "desc" : "asc"}`);
    if (state.limitCount) params.set("limit", String(state.limitCount));

    const data = await request<unknown[]>(`/rest/v1/${state.table}?${params.toString()}`);
    return { data: state.single === "maybe" ? (data[0] ?? null) : data, error: null };
  };

  const query = {
    select(columns = "*") {
      state.select = columns;
      return query;
    },
    order(column: string, options?: { ascending?: boolean }) {
      state.orderColumn = column;
      state.ascending = options?.ascending ?? true;
      return query;
    },
    limit(count: number) {
      state.limitCount = count;
      return query;
    },
    eq(column: string, value: string) {
      state.filters.push({ column, value });
      return query;
    },
    maybeSingle() {
      state.single = "maybe";
      return runSelect();
    },
    then<TResult1 = Awaited<ReturnType<typeof runSelect>>, TResult2 = never>(
      onfulfilled?: ((value: Awaited<ReturnType<typeof runSelect>>) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ) {
      return runSelect().then(onfulfilled, onrejected);
    },
  };

  return query;
}

export async function getSupabase() {
  const auth = {
    onAuthStateChange(callback: AuthCallback) {
      authSubscribers.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => authSubscribers.delete(callback),
          },
        },
      };
    },
    async getSession() {
      return { data: { session: getStoredSession() }, error: null };
    },
    async signUp({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, unknown>; emailRedirectTo?: string } }) {
      try {
        const search = options?.emailRedirectTo ? `?redirect_to=${encodeURIComponent(options.emailRedirectTo)}` : "";
        await request(`/auth/v1/signup${search}`, {
          method: "POST",
          body: JSON.stringify({ email, password, data: options?.data ?? {} }),
        });
        return { data: null, error: null };
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      try {
        const data = await request<AuthSession>("/auth/v1/token?grant_type=password", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setStoredSession(data);
        return { data, error: null };
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },
    async signOut() {
      setStoredSession(null);
      return { error: null };
    },
  };

  return {
    auth,
    from(table: string) {
      return {
        select(columns = "*") {
          return createTableQuery({ table, select: columns, filters: [] });
        },
        async insert(values: Record<string, unknown>) {
          try {
            const data = await request(`/rest/v1/${table}`, {
              method: "POST",
              headers: { Prefer: "return=representation" },
              body: JSON.stringify(values),
            });
            return { data, error: null };
          } catch (error) {
            return { data: null, error: error as Error };
          }
        },
        update(values: Record<string, unknown>) {
          return {
            eq: async (column: string, value: string) => {
              try {
                const data = await request(`/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`, {
                  method: "PATCH",
                  headers: { Prefer: "return=representation" },
                  body: JSON.stringify(values),
                });
                return { data, error: null };
              } catch (error) {
                return { data: null, error: error as Error };
              }
            },
          };
        },
        delete() {
          return {
            eq: async (column: string, value: string) => {
              try {
                const data = await request(`/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`, {
                  method: "DELETE",
                  headers: { Prefer: "return=representation" },
                });
                return { data, error: null };
              } catch (error) {
                return { data: null, error: error as Error };
              }
            },
          };
        },
      };
    },
    channel(_name?: string) {
      const channel = {
        on(..._args: unknown[]) { return channel; },
        subscribe() { return channel; },
        unsubscribe() {},
      };
      return channel;
    },
    removeChannel(channel: { unsubscribe?: () => void }) {
      channel.unsubscribe?.();
    },
  };
}

export function getSupabaseLoadMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Connection failed. Please try again.";
}
