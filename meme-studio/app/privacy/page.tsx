import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import {
  LEGAL_OWNER,
  PRIVACY_LAST_UPDATED,
  privacySections,
} from "@/lib/legal/privacy-it"
import { t } from "@/lib/i18n/it"

export const metadata: Metadata = {
  title: `Privacy Policy — ${t.app.name}`,
  description:
    "Informativa sul trattamento dei dati personali per MemeForge, in conformità al Regolamento UE 2016/679 (GDPR).",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.legal.backHome}
          </Link>
          <div className="ml-auto flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-fuchsia-600" />
            <span>{t.app.name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <h1 className="font-display text-4xl tracking-tight md:text-5xl">
            {t.legal.privacyTitle}
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            {t.legal.lastUpdated}: {PRIVACY_LAST_UPDATED}
          </p>
          <p className="mt-6 text-zinc-600 dark:text-zinc-400">
            {t.legal.privacyIntro}
          </p>

          <div className="mt-10 space-y-10">
            {privacySections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {section.paragraphs.map((p, i) => (
                    <p key={`${section.id}-p-${i}`}>{p}</p>
                  ))}
                  {section.list && (
                    <ul className="list-disc space-y-2 pl-5">
                      {section.list.map((item, i) => (
                        <li key={`${section.id}-li-${i}`}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-16 border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800">
            <p>
              {t.legal.contactLabel}:{" "}
              <a
                href={`mailto:${LEGAL_OWNER.email}`}
                className="text-fuchsia-600 hover:underline"
              >
                {LEGAL_OWNER.email}
              </a>
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} {t.app.name}
            </p>
          </footer>
        </article>
      </main>
    </div>
  )
}
