"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global root layout error captured:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-4 text-center text-white">
        <div className="relative z-10 max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-600 shadow-xl shadow-amber-950/40">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            System Error
          </h1>

          <p className="mt-4 text-sm text-stone-400 sm:text-base leading-relaxed">
            A critical system error occurred. Please try reloading the page.
          </p>

          {error.digest && (
            <p className="mt-2 text-xs font-mono text-stone-500">Error ID: {error.digest}</p>
          )}

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-900/40 transition hover:from-rose-500 hover:to-red-500 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
