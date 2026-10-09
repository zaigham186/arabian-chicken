"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const API =
  (typeof process !== "undefined" && process.env?.["NEXT_PUBLIC_API_URL"]) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "";

const CATEGORIES = [
  ["pizza", "Pizza"],
  ["meals", "Meals"],
  ["china", "China Dishes"],
  ["burgers", "Burgers"],
  ["fried-chicken", "Chicken"],
  ["hot-wings", "Hot Wings"],
  ["nuggets", "Nuggets"],
  ["rolls", "Rolls"],
  ["fries", "Fries"],
  ["related", "Related Orders"],
  ["drinks", "Drinks & Desserts"],
  ["wings", "New Arrival: Wings"],
  ["chicken", "New Arrival: Chicken"],
  ["soup", "New Arrival: Soup"],
  ["family-extras", "Family: Pasta, Nachos..."],
] as const;

const DEAL_GROUPS = [
  ["deal", "Pizza Deals"],
  ["double", "Double Deals"],
  ["family", "Family Deals"],
] as const;

type Price = { label: string; value: number | string };

const input =
  "w-full rounded-lg border border-border bg-charcoal-deep px-3 py-2 text-sm text-foreground outline-none focus:border-accent";
const btn = "rounded-lg px-4 py-2 text-sm font-bold transition-colors";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function verifySession() {
      const stored = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      try {
        const res = await fetch(`${API}/api/admin/verify`, {
          credentials: "include",
          headers: stored ? { Authorization: `Bearer ${stored}` } : {},
        });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.authenticated) {
            setToken(stored || "cookie_session");
            setReady(true);
            return;
          }
        }
      } catch {
        // network or server error
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
      }
      setToken(null);
      setReady(true);
    }

    verifySession();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    setToken(null);
  };

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <p className="text-sm font-semibold text-muted-foreground">Checking authorization...</p>
      </div>
    );
  }

  if (!token)
    return (
      <Login
        onLogin={(t) => {
          if (typeof window !== "undefined") {
            localStorage.setItem("admin_token", t);
          }
          setToken(t);
        }}
      />
    );
  return <Dashboard token={token} onLogout={logout} />;
}

/* ---------------- Login ---------------- */
function Login({ onLogin }: { onLogin: (t: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Login failed");
      onLogin(data.token);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-charcoal-card p-8">
        <h1 className="font-display text-2xl font-black text-foreground">Admin Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Arabian Chick, N</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className={`${input} mt-6`}
          disabled={busy}
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          onClick={submit}
          disabled={busy}
          className={`${btn} mt-5 w-full bg-primary text-primary-foreground hover:bg-brand-red-deep disabled:opacity-50`}
        >
          {busy ? "Please wait..." : "Login"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"items" | "deals">("items");
  const [items, setItems] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [editing, setEditing] = useState<any | null>(null); // {} = new
  const [msg, setMsg] = useState("");

  const api = useCallback(
    async (path: string, method = "GET", body?: unknown) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token && token !== "cookie_session") {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const r = await fetch(`${API}${path}`, {
        method,
        headers,
        credentials: "include",
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      if (r.status === 401) {
        onLogout();
        throw new Error("Session expired, dobara login karein");
      }
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Request failed");
      return data;
    },
    [token, onLogout],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [i, d] = await Promise.all([api("/api/items"), api("/api/deals")]);
      setItems(i);
      setDeals(d);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  };

  const base = tab === "items" ? "/api/items" : "/api/deals";

  const toggle = async (row: any) => {
    try {
      await api(`${base}/${row._id}`, "PUT", { available: row.available === false });
      await load();
    } catch (e: any) {
      flash(e.message);
    }
  };

  const remove = async (row: any) => {
    if (!confirm(`"${row.name ?? row.title}" delete karna hai?`)) return;
    try {
      await api(`${base}/${row._id}`, "DELETE");
      flash("Deleted");
      await load();
    } catch (e: any) {
      flash(e.message);
    }
  };

  const save = async (data: any) => {
    if (data._id) await api(`${base}/${data._id}`, "PUT", data);
    else await api(base, "POST", data);
    setEditing(null);
    flash("Saved");
    await load();
  };

  const q = search.toLowerCase();
  const itemRows = items.filter(
    (i) =>
      (catFilter === "all" || i.category === catFilter) && (i.name ?? "").toLowerCase().includes(q),
  );
  const dealRows = deals.filter((d) => `${d.title} ${d.badge ?? ""}`.toLowerCase().includes(q));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-charcoal-deep">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <h1 className="font-display text-lg font-black">Arabian Chick, N · Admin</h1>
          <div className="flex gap-2">
            <Link href="/" className={`${btn} border border-border hover:border-accent`}>
              View site
            </Link>
            <button
              onClick={onLogout}
              className={`${btn} border border-border hover:border-accent`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-2">
          {(["items", "deals"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setSearch("");
              }}
              className={`${btn} ${
                tab === t ? "bg-primary text-primary-foreground" : "border border-border"
              }`}
            >
              {t === "items" ? `Items (${items.length})` : `Deals (${deals.length})`}
            </button>
          ))}
          <button
            onClick={() => setEditing({})}
            className={`${btn} ml-auto bg-accent text-accent-foreground`}
          >
            + Add {tab === "items" ? "Item" : "Deal"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${input} max-w-xs`}
          />
          {tab === "items" && (
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className={`${input} max-w-xs`}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          )}
        </div>

        {msg && (
          <p className="mt-4 rounded-lg bg-accent/15 px-4 py-2 text-sm font-semibold text-accent">
            {msg}
          </p>
        )}
        {loading && <p className="mt-6 text-muted-foreground">Loading...</p>}

        <div className="mt-5 space-y-3">
          {(tab === "items" ? itemRows : dealRows).map((row) => (
            <Row
              key={row._id}
              row={row}
              isItem={tab === "items"}
              onEdit={() => setEditing(row)}
              onDelete={() => remove(row)}
              onToggle={() => toggle(row)}
            />
          ))}
          {!loading && (tab === "items" ? itemRows : dealRows).length === 0 && (
            <p className="text-muted-foreground">Kuch nahi mila.</p>
          )}
        </div>
      </main>

      {editing && (
        <Editor
          isItem={tab === "items"}
          initial={editing}
          token={token}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

/* ---------------- List row ---------------- */
function Row({
  row,
  isItem,
  onEdit,
  onDelete,
  onToggle,
}: {
  row: any;
  isItem: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const soldOut = row.available === false;
  const summary = isItem
    ? (row.prices ?? []).map((p: Price) => `${p.label} Rs.${p.value}`).join(" · ")
    : `Rs.${row.price}`;

  return (
    <div
      className={`flex flex-wrap items-center gap-4 rounded-xl border border-border bg-charcoal-card p-3 ${
        soldOut ? "opacity-60" : ""
      }`}
    >
      {row.imageUrl ? (
        <img src={row.imageUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
      ) : (
        <div className="grid h-16 w-16 place-items-center rounded-lg bg-charcoal-deep text-2xl">
          🍽️
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">
          {row.name ?? row.title}
          {soldOut && <span className="ml-2 text-xs font-black text-red-400">SOLD OUT</span>}
        </p>
        <p className="text-xs text-muted-foreground">
          {isItem ? row.category : `${row.badge ?? ""} · ${row.group}`}
        </p>
        <p className="mt-1 truncate text-xs text-foreground/80">{summary}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`${btn} border border-border text-xs hover:border-accent`}
        >
          {soldOut ? "Mark available" : "Mark sold out"}
        </button>
        <button onClick={onEdit} className={`${btn} bg-accent text-xs text-accent-foreground`}>
          Edit
        </button>
        <button
          onClick={onDelete}
          className={`${btn} bg-red-600 text-xs text-white hover:bg-red-700`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ---------------- Add / Edit form ---------------- */
function Editor({
  isItem,
  initial,
  token,
  onClose,
  onSave,
}: {
  isItem: boolean;
  initial: any;
  token: string;
  onClose: () => void;
  onSave: (d: any) => Promise<void>;
}) {
  const [f, setF] = useState<any>(() => ({
    available: true,
    ...(isItem ? { category: "pizza", prices: [{ label: "", value: "" }] } : { group: "deal" }),
    ...initial,
    prices: initial.prices?.length ? initial.prices : [{ label: "", value: "" }],
  }));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const setPrice = (i: number, k: keyof Price, v: string) =>
    set(
      "prices",
      f.prices.map((p: Price, idx: number) => (idx === i ? { ...p, [k]: v } : p)),
    );

  const upload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }
    if (!/^image\/(jpeg|png|webp|avif|gif)$/i.test(file.type)) {
      setError("Please choose a valid image (jpg, png, webp, avif)");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const headers: Record<string, string> = {};
      if (token && token !== "cookie_session") {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const r = await fetch(`${API}/api/upload`, {
        method: "POST",
        headers,
        credentials: "include",
        body: fd,
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Upload failed");
      set("imageUrl", data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    setError("");
    const name = isItem ? f.name : f.title;
    if (!name?.trim()) return setError("Naam zaroori hai");

    const payload = { ...f };
    if (isItem) {
      const prices = f.prices
        .filter((p: Price) => String(p.label).trim() && String(p.value).trim() !== "")
        .map((p: Price) => ({ label: String(p.label).trim(), value: Number(p.value) }));
      if (prices.length === 0) return setError("Kam az kam ek price (label + rate) daalein");
      if (prices.some((p: Price) => Number.isNaN(p.value)))
        return setError("Price number honi chahiye");
      payload.prices = prices;
      if (payload.category !== "pizza") delete payload.group;
    } else {
      payload.price = Number(f.price);
      if (!f.price || Number.isNaN(payload.price)) return setError("Price number honi chahiye");
      delete payload.prices;
    }

    setSaving(true);
    try {
      await onSave(payload);
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-black/70 p-4">
      <div className="my-8 w-full max-w-xl rounded-2xl border border-border bg-charcoal-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-black">
            {initial._id ? "Edit" : "Add"} {isItem ? "Item" : "Deal"}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none text-muted-foreground">
            ×
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Image */}
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground">Image</label>
            <div className="mt-2 flex items-center gap-4">
              {f.imageUrl ? (
                <img src={f.imageUrl} alt="" className="h-20 w-20 rounded-lg object-cover" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-lg bg-charcoal-deep text-3xl">
                  🍽️
                </div>
              )}
              <label className={`${btn} cursor-pointer border border-border hover:border-accent`}>
                {uploading ? "Uploading..." : "Choose image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          {isItem ? (
            <>
              <Field label="Name">
                <input
                  className={input}
                  value={f.name ?? ""}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label="Category">
                <select
                  className={input}
                  value={f.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {CATEGORIES.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              {f.category === "pizza" && (
                <Field label="Pizza section">
                  <select
                    className={input}
                    value={f.group ?? "hot"}
                    onChange={(e) => set("group", e.target.value)}
                  >
                    <option value="hot">Hot Pizza</option>
                    <option value="crust">Special Crust Pizza</option>
                    <option value="extras">Extras & Rolls</option>
                  </select>
                </Field>
              )}
              <Field label="Description (optional)">
                <textarea
                  rows={2}
                  className={input}
                  value={f.description ?? ""}
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>
              <Field label="Tag (optional, jaise New Arrival)">
                <input
                  className={input}
                  value={f.tag ?? ""}
                  onChange={(e) => set("tag", e.target.value)}
                />
              </Field>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Prices (size / piece aur rate)
                </label>
                <div className="mt-2 space-y-2">
                  {f.prices.map((p: Price, i: number) => (
                    <div key={i} className="flex gap-2">
                      <input
                        placeholder="Label (Small, 5 Piece...)"
                        className={input}
                        value={p.label}
                        onChange={(e) => setPrice(i, "label", e.target.value)}
                      />
                      <input
                        placeholder="Rs"
                        type="number"
                        className={`${input} max-w-28`}
                        value={p.value}
                        onChange={(e) => setPrice(i, "value", e.target.value)}
                      />
                      <button
                        onClick={() =>
                          set(
                            "prices",
                            f.prices.filter((_: Price, idx: number) => idx !== i),
                          )
                        }
                        className="px-2 text-red-400"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => set("prices", [...f.prices, { label: "", value: "" }])}
                  className={`${btn} mt-2 border border-border text-xs hover:border-accent`}
                >
                  + Add size
                </button>
              </div>
            </>
          ) : (
            <>
              <Field label="Title">
                <input
                  className={input}
                  value={f.title ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                />
              </Field>
              <Field label="Badge (jaise Deal 1, Family Combo)">
                <input
                  className={input}
                  value={f.badge ?? ""}
                  onChange={(e) => set("badge", e.target.value)}
                />
              </Field>
              <Field label="Section">
                <select
                  className={input}
                  value={f.group}
                  onChange={(e) => set("group", e.target.value)}
                >
                  {DEAL_GROUPS.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Contents">
                <textarea
                  rows={2}
                  className={input}
                  value={f.contents ?? ""}
                  onChange={(e) => set("contents", e.target.value)}
                />
              </Field>
              <Field label="Price (Rs)">
                <input
                  type="number"
                  className={input}
                  value={f.price ?? ""}
                  onChange={(e) => set("price", e.target.value)}
                />
              </Field>
            </>
          )}

          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={f.available !== false}
              onChange={(e) => set("available", e.target.checked)}
            />
            Available (uncheck = sold out, website par nahi dikhega)
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className={`${btn} border border-border`}>
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving || uploading}
            className={`${btn} bg-primary text-primary-foreground hover:bg-brand-red-deep`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
