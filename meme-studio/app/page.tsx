import Link from "next/link"
import {
  ArrowRight,
  Layers,
  Palette,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { FORMATS } from "@/lib/formats"
import { t } from "@/lib/i18n/it"
import { hasStripeConfigured } from "@/lib/env"

export default function Home() {
  const isLocalMode = !hasStripeConfigured
  return (
    <div className="flex min-h-screen flex-col">
      <Nav isLocalMode={isLocalMode} />
      <main className="flex-1">
        <Hero />
        <Features />
        <Formats />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}

function Nav({ isLocalMode }: { isLocalMode: boolean }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 md:px-8">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Sparkles className="h-5 w-5 text-fuchsia-600" />
        <span className="tracking-tight">{t.app.name}</span>
      </Link>
      {isLocalMode && (
        <span className="ml-3 hidden items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900 md:inline-flex">
          modalità locale
        </span>
      )}
      <nav className="ml-auto flex items-center gap-2">
        <Link
          href="#pricing"
          className="hidden px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 md:inline-block"
        >
          {t.nav.pricing}
        </Link>
        <Link
          href="https://github.com/vickhunter/cursor_meme"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 md:inline-block"
        >
          {t.nav.github}
        </Link>
        <Link href="/studio">
          <Button size="sm">
            {t.nav.openStudio}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 text-center md:pb-32 md:pt-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <Sparkles className="h-3 w-3 text-fuchsia-600" />
          {t.landing.heroBadge}
        </span>
        <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          {t.landing.heroTitle}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {t.landing.heroSub}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/studio">
            <Button size="lg" variant="primary">
              {t.landing.heroCta}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="#formats">
            <Button size="lg" variant="outline">
              {t.landing.heroCtaSecondary}
            </Button>
          </Link>
        </div>
        <HeroPreview />
      </div>
    </section>
  )
}

function HeroPreview() {
  return (
    <div className="mx-auto mt-16 max-w-5xl">
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {FORMATS.map((f, i) => {
          const aspect = f.w / f.h
          const rotate = i % 2 === 0 ? "-rotate-1" : "rotate-1"
          const colors = [
            "from-fuchsia-500 to-amber-400",
            "from-cyan-500 to-blue-600",
            "from-emerald-500 to-teal-600",
            "from-orange-500 to-red-500",
            "from-violet-500 to-fuchsia-600",
            "from-yellow-400 to-orange-500",
          ]
          return (
            <div
              key={f.id}
              className={`group relative flex flex-col rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-transform hover:scale-105 ${rotate} dark:border-zinc-800 dark:bg-zinc-900`}
            >
              <div
                className={`w-full overflow-hidden rounded-md bg-gradient-to-br ${colors[i]}`}
                style={{ aspectRatio: aspect }}
              >
                <div className="flex h-full items-center justify-center px-2">
                  <span className="text-center font-display text-xl uppercase leading-tight text-white drop-shadow-lg md:text-2xl">
                    Meme
                  </span>
                </div>
              </div>
              <span className="mt-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {f.label}
              </span>
              <span className="text-[10px] text-zinc-400">
                {f.w}×{f.h}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Features() {
  const items = [
    {
      icon: Layers,
      title: t.landing.feature1Title,
      desc: t.landing.feature1Desc,
    },
    {
      icon: Palette,
      title: t.landing.feature2Title,
      desc: t.landing.feature2Desc,
    },
    {
      icon: Zap,
      title: t.landing.feature3Title,
      desc: t.landing.feature3Desc,
    },
  ]
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <it.icon className="h-5 w-5 text-fuchsia-600" />
              </div>
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Formats() {
  return (
    <section id="formats" className="py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="font-display text-4xl tracking-tight md:text-5xl">
          {t.landing.formatsTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          {t.landing.formatsDesc}
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {FORMATS.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-5 text-left dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="text-sm font-semibold">{f.label}</div>
              <div className="mt-1 text-xs text-zinc-500">
                {f.w}×{f.h}px
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section
      id="pricing"
      className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-4xl tracking-tight md:text-5xl">
          {t.landing.pricingTitle}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-left dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-2xl font-semibold">
              {t.landing.pricingFreeTitle}
            </h3>
            <div className="mt-1 text-3xl font-bold">€0</div>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {t.landing.pricingFreeDesc}
            </p>
            <Link href="/studio" className="mt-6 block">
              <Button variant="outline" className="w-full">
                {t.landing.pricingFreeCta}
              </Button>
            </Link>
          </div>
          <div className="relative rounded-2xl border-2 border-fuchsia-500 bg-white p-8 text-left dark:bg-zinc-950">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-fuchsia-600 px-3 py-1 text-xs font-semibold text-white">
              <Wand2 className="-mt-0.5 mr-1 inline h-3 w-3" />
              HD
            </span>
            <h3 className="text-2xl font-semibold">
              {t.landing.pricingHdTitle}
            </h3>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold">{t.landing.pricingHdPrice}</span>
              <span className="text-sm text-zinc-500">
                {t.landing.pricingHdPer}
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {t.landing.pricingHdDesc}
            </p>
            <Link href="/studio" className="mt-6 block">
              <Button variant="accent" className="w-full">
                {t.landing.pricingHdCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6">
        <p>
          {t.landing.footerMadeWith} · ©{" "}
          {new Date().getFullYear()} {t.app.name}
        </p>
        <p className="mt-2">
          <Link
            href="/privacy"
            className="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            {t.legal.footerPrivacy}
          </Link>
        </p>
      </div>
    </footer>
  )
}
