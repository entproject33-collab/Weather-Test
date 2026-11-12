'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Atmosphere } from '@/components/weather/atmosphere'
import { Logo } from '@/components/weather/ui'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="skyline-app min-h-dvh">
      <Atmosphere />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <Logo />
        <p className="mt-12 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
          Something went wrong
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl">
          The sky is out of reach.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">
          We couldn&apos;t load the forecast just now. The weather service may be taking a
          moment — give it another try.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[13px] font-semibold text-[#080b12] transition-transform hover:scale-[1.02]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 text-[13px] font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
          >
            Back to the default city
          </Link>
        </div>
      </div>
    </div>
  )
}
