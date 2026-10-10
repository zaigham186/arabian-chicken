"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors securely without leaking PII
    console.error("Unhandled client error captured:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-4 text-center text-white selection:bg-rose-500 selection:text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-rose-600/15 blur-3xl" />

      <div className="relative z-10 max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-600 shadow-xl shadow-amber-950/40">
          <AlertTriangle className="h-10 w-10 text-white" />
        </div>

        <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
          Something Went Wrong
        </span>

        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Kitchen Hiccup!
        </h1>

        <p className="mt-4 text-sm text-stone-400 sm:text-base leading-relaxed">
          We encountered an unexpected issue while loading this page. Don&apos;t worry, your cart
          and session data are safe.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs font-mono text-stone-500">Reference code: {error.digest}</p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-900/40 transition hover:from-rose-500 hover:to-red-500 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-800 bg-stone-900/80 px-6 py-3.5 text-sm font-semibold text-stone-200 transition hover:bg-stone-800 hover:text-white active:scale-95"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
