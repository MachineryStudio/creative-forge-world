import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { sfx } from "@/lib/sfx";
import { getSupabase, getSupabaseLoadMessage } from "@/lib/lazySupabase";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — World Space" },
      { name: "description", content: "Digital downloads: 3D models, brushes, PDFs and more." },
      { property: "og:title", content: "Marketplace — World Space" },
      { property: "og:description", content: "Digital downloads: 3D models, brushes, PDFs and more." },
    ],
  }),
  component: Marketplace,
});

interface Product {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  category: string;
  price_cents: number;
  image_url: string | null;
  download_url: string | null;
  created_at: string;
}

const CATEGORIES = ["3d-model", "zbrush-brush", "texture", "pdf-tutorial", "python-script"];

interface AuthUser {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}

function Marketplace() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    getSupabase()
      .then((supabase) => {
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser((s?.user as AuthUser) ?? null));
        unsubscribe = () => sub.subscription.unsubscribe();
        supabase.auth.getSession().then(({ data }) => setUser((data.session?.user as AuthUser) ?? null));
      })
      .catch((err) => console.warn(getSupabaseLoadMessage(err)));

    return () => unsubscribe?.();
  }, []);

  async function load() {
    try {
      const supabase = await getSupabase();
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data as Product[]);
    } catch (err) {
      console.warn(getSupabaseLoadMessage(err));
    }
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl neon-text">Marketplace</h1>
            <p className="text-sm text-muted-foreground">Digital downloads: models · brushes · PDFs · scripts.</p>
          </div>
          {user && (
            <button
              onClick={() => { sfx.click(); setOpen(true); }}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-display text-xs text-primary-foreground neon-glow"
            >
              <Plus className="h-3 w-3" /> List Product
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="panel p-12 text-center text-muted-foreground">
            No products yet. {user ? "List one above." : "Sign in to list one."}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article key={p.id} className="panel scanlines relative overflow-hidden">
                {p.image_url && (
                  <img src={p.image_url} alt={p.title} className="aspect-video w-full object-cover" loading="lazy" />
                )}
                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-display text-[10px] uppercase tracking-widest text-primary">{p.category}</span>
                    <span className="font-display text-sm">${(p.price_cents / 100).toFixed(2)}</span>
                  </div>
                  <h3 className="font-display text-lg">{p.title}</h3>
                  {p.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{p.description}</p>}
                  <button
                    onClick={() => { sfx.coin(); alert("Checkout coming soon — payments integration is in the next iteration."); }}
                    className="mt-3 w-full rounded-md border border-primary px-3 py-2 text-xs text-primary hover:bg-primary/10"
                  >
                    Buy / Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {open && user && <ProductForm onClose={() => setOpen(false)} onSaved={() => { setOpen(false); load(); }} userId={user.id} />}
    </div>
  );
}

function ProductForm({ onClose, onSaved, userId }: { onClose: () => void; onSaved: () => void; userId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("9.99");
  const [imageUrl, setImageUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from("products").insert({
        owner_id: userId,
        title, description, category,
        price_cents: Math.round(parseFloat(price || "0") * 100),
        image_url: imageUrl || null,
        download_url: downloadUrl || null,
      });
      if (error) throw error;
      sfx.coin();
      onSaved();
    } catch (err) {
      sfx.death();
      alert(getSupabaseLoadMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background/80 p-4 backdrop-blur">
      <form onSubmit={save} className="panel scanlines relative w-full max-w-md space-y-3 p-6">
        <h2 className="font-display text-xl neon-text">List a Product</h2>
        <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" rows={3} />
        <div className="flex gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" step="0.01" min="0" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-24 rounded-md border border-border bg-input px-3 py-2 text-sm" />
        </div>
        <input placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
        <input placeholder="Download URL (optional)" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)}
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-md border border-border px-3 py-2 text-sm">Cancel</button>
          <button disabled={busy} type="submit"
            className="flex-1 rounded-md bg-gradient-to-r from-primary to-accent px-3 py-2 font-display text-sm text-primary-foreground disabled:opacity-50">
            {busy ? "..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
