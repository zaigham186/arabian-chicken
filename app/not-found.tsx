import Link from "next/link";
import { Utensils, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-4 text-center text-white selection:bg-rose-500 selection:text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-rose-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-600/10 blur-3xl" />

      <div className="relative z-10 max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-xl shadow-rose-950/50">
          <Utensils className="h-10 w-10 text-white" />
        </div>

        <span className="inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-400">
          404 • Page Not Found
        </span>

        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
          Recipe Not Found
        </h1>

        <p className="mt-4 text-sm text-stone-400 sm:text-base leading-relaxed">
          The dish or page you are looking for isn&apos;t on our menu or might have moved. Our
          crispy broast, sizzling BBQ, and handcrafted pizzas are still waiting for you!
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-900/40 transition hover:from-rose-500 hover:to-red-500 active:scale-95"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/#menu"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-800 bg-stone-900/80 px-6 py-3.5 text-sm font-semibold text-stone-200 transition hover:bg-stone-800 hover:text-white active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Explore Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
