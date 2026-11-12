import Link from 'next/link'
import { Atmosphere } from '@/components/weather/atmosphere'
import { Logo } from '@/components/weather/ui'

export default function NotFound() {
  return (
    <div className="skyline-app min-h-dvh">
      <Atmosphere />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <Logo />
        <p className="mt-12 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
          404 · Off the map
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl">
          There&apos;s no weather here.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">
          This page drifted away. Head back to the dashboard and search for a city instead.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[13px] font-semibold text-[#080b12] transition-transform hover:scale-[1.02]"
        >
          Back to the dashboard
        </Link>
      </div>
    </div>
  )
}
