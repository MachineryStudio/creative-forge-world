export async function getSupabase() {
  const { supabase } = await import("@/integrations/supabase/client");
  return supabase;
}

export function getSupabaseLoadMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Connection is refreshing. Please hard-reload the preview and try again.";
}
