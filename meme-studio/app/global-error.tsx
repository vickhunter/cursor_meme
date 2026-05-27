"use client"

import { t } from "@/lib/i18n/it"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="it">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-semibold">{t.errors.generic}</h1>
          <p className="max-w-md text-sm text-zinc-500">
            {error.digest ? `ID: ${error.digest}` : null}
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Riprova
          </button>
        </main>
      </body>
    </html>
  )
}
