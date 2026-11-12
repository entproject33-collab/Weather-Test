import type { CSSProperties } from 'react'
import {
  formatDayNameShort,
  formatShortDate,
  formatTemperature,
  type Unit,
} from '@/lib/format'
import { getCondition, type DayForecast } from '@/lib/weather'
import { WeatherIcon } from './weather-icon'
import { CalendarIcon, CardHeading, DropletIcon } from './ui'

type DailyForecastProps = {
  days: DayForecast[]
  unit: Unit
}

export function DailyForecast({ days, unit }: DailyForecastProps) {
  if (days.length === 0) return null

  const weekMin = Math.min(...days.map((day) => day.min))
  const weekMax = Math.max(...days.map((day) => day.max))
  const span = Math.max(1, weekMax - weekMin)

  return (
    <section
      className="panel rise flex flex-col p-5 sm:p-6 lg:col-span-7"
      style={{ '--delay': '230ms' } as CSSProperties}
    >
      <CardHeading
        icon={<CalendarIcon className="size-3.5" />}
        trailing={
          <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/25">
            7 days
          </span>
        }
      >
        Daily outlook
      </CardHeading>

      <div className="mt-3 flex-1 divide-y divide-white/[0.055]">
        {days.map((day, index) => {
          const condition = getCondition(day.weatherCode)
          const lowPercent = ((day.min - weekMin) / span) * 100
          const widthPercent = Math.max(5, ((day.max - day.min) / span) * 100)

          return (
            <div
              key={day.date}
              className="grid grid-cols-[62px_30px_minmax(0,1fr)] items-center gap-3 py-[13px] sm:grid-cols-[118px_minmax(0,1fr)_260px]"
            >
              <div>
                <p
                  className={`text-[12.5px] font-medium ${
                    index === 0 ? 'text-white/90' : 'text-white/65'
                  }`}
                >
                  {formatDayNameShort(day.date, index)}
                </p>
                <p className="mt-0.5 text-[10px] text-white/25">{formatShortDate(day.date)}</p>
              </div>

              <div className="hidden min-w-0 items-center gap-3 sm:flex">
                <WeatherIcon code={day.weatherCode} className="size-8 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-[12px] text-white/65">{condition.short}</p>
                  {day.precipitationProbabilityMax > 10 ? (
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-sky-300/70">
                      <DropletIcon className="size-2.5" />
                      {day.precipitationProbabilityMax}%
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center sm:hidden">
                <WeatherIcon code={day.weatherCode} className="size-7" />
                {day.precipitationProbabilityMax > 10 ? (
                  <span className="mt-0.5 text-[9px] font-medium leading-none text-sky-300/70">
                    {day.precipitationProbabilityMax}%
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <span className="w-7 text-right text-[11.5px] tabular-nums text-white/35">
                  {formatTemperature(day.min, unit)}
                </span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.055]">
                  <div
                    className={`absolute inset-y-0 rounded-full ${
                      index === 0
                        ? 'bg-[var(--accent)]'
                        : 'bg-[var(--accent)]/35'
                    }`}
                    style={{ left: `${lowPercent}%`, width: `${widthPercent}%` }}
                  />
                </div>
                <span className="w-7 text-[11.5px] tabular-nums text-white/85">
                  {formatTemperature(day.max, unit)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
