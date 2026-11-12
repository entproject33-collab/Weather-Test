import type { CSSProperties } from 'react'
import {
  formatClock,
  formatDaylight,
  formatDurationMinutes,
  minutesIntoDay,
} from '@/lib/format'
import { clamp, type CurrentConditions, type DayForecast } from '@/lib/weather'
import { CardHeading, SunriseIcon, SunsetIcon } from './ui'

type SunCardProps = {
  current: CurrentConditions
  today: DayForecast
}

function arcPoint(progress: number): { x: number; y: number } {
  const inverse = 1 - progress
  return {
    x: inverse * inverse * 20 + 2 * inverse * progress * 140 + progress * progress * 260,
    y: inverse * inverse * 118 + 2 * inverse * progress * -12 + progress * progress * 118,
  }
}

export function SunCard({ current, today }: SunCardProps) {
  const sunrise = today.sunrise
  const sunset = today.sunset
  const now = minutesIntoDay(current.time)
  const sunriseMinutes = sunrise ? minutesIntoDay(sunrise) : null
  const sunsetMinutes = sunset ? minutesIntoDay(sunset) : null

  const progress =
    sunriseMinutes !== null && sunsetMinutes !== null && sunsetMinutes > sunriseMinutes
      ? clamp((now - sunriseMinutes) / (sunsetMinutes - sunriseMinutes), 0, 1)
      : 0

  const isDaytime =
    sunriseMinutes !== null && sunsetMinutes !== null
      ? now >= sunriseMinutes && now <= sunsetMinutes
      : current.isDay

  const sunPoint = arcPoint(progress)

  let status = 'Daylight'
  if (sunriseMinutes !== null && sunsetMinutes !== null) {
    if (now < sunriseMinutes) {
      status = `Rises in ${formatDurationMinutes(sunriseMinutes - now)}`
    } else if (now <= sunsetMinutes) {
      status = `Sets in ${formatDurationMinutes(sunsetMinutes - now)}`
    } else {
      status = `Rises at ${sunrise ? formatClock(sunrise) : '—'}`
    }
  }

  return (
    <section
      className="panel rise p-5 sm:p-6"
      style={{ '--delay': '290ms' } as CSSProperties}
    >
      <CardHeading
        icon={<SunriseIcon className="size-3.5" />}
        trailing={
          <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-white/40">
            {status}
          </span>
        }
      >
        Sun &amp; daylight
      </CardHeading>

      <div className="mt-3">
        <svg
          viewBox="0 0 280 132"
          className="h-auto w-full"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="8" y1="118" x2="272" y2="118" stroke="rgba(255,255,255,0.09)" />
          <path
            d="M 20 118 Q 140 -12 260 118"
            fill="none"
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="1.4"
            strokeDasharray="2 5"
          />
          {progress > 0.015 ? (
            <path
              d="M 20 118 Q 140 -12 260 118"
              fill="none"
              style={{ stroke: 'var(--accent)' }}
              strokeWidth="1.8"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`${progress} 1`}
            />
          ) : null}

          <circle cx="20" cy="118" r="2" fill="rgba(255,255,255,0.35)" />
          <circle cx="260" cy="118" r="2" fill="rgba(255,255,255,0.35)" />

          {isDaytime ? (
            <>
              <circle
                cx={sunPoint.x}
                cy={sunPoint.y}
                r="12"
                style={{ fill: 'var(--accent)' }}
                opacity="0.14"
              />
              <circle
                cx={sunPoint.x}
                cy={sunPoint.y}
                r="5"
                style={{ fill: 'var(--accent)' }}
              />
            </>
          ) : null}
        </svg>
      </div>

      <div className="mt-1 flex items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">
            <SunriseIcon className="size-3" />
            Sunrise
          </p>
          <p className="mt-1 text-[13px] font-medium text-white/75">
            {sunrise ? formatClock(sunrise) : '—'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">
            Daylight
          </p>
          <p className="mt-1 text-[13px] font-medium text-white/75">
            {formatDaylight(today.daylightSeconds)}
          </p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">
            <SunsetIcon className="size-3" />
            Sunset
          </p>
          <p className="mt-1 text-[13px] font-medium text-white/75">
            {sunset ? formatClock(sunset) : '—'}
          </p>
        </div>
      </div>
    </section>
  )
}
