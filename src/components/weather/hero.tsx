import type { CSSProperties } from 'react'
import {
  formatClock,
  formatFullDate,
  formatTemperature,
  formatTemperatureValue,
  formatWind,
  type Unit,
} from '@/lib/format'
import {
  getCondition,
  placeLabel,
  placeSecondary,
  type CurrentConditions,
  type DayForecast,
  type HourPoint,
  type Place,
} from '@/lib/weather'
import { WeatherIcon } from './weather-icon'
import { ArrowDownIcon, ArrowUpIcon, ClockIcon, PinIcon, RefreshIcon } from './ui'

type HeroProps = {
  place: Place
  current: CurrentConditions
  today: DayForecast
  hourly: HourPoint[]
  unit: Unit
  updatedLabel: string
  refreshing: boolean
  onRefresh: () => void
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function summarize(
  current: CurrentConditions,
  today: DayForecast,
  hourly: HourPoint[],
  unit: Unit,
): string {
  const condition = getCondition(current.weatherCode)
  const noun =
    condition.kind === 'snow'
      ? 'snow'
      : condition.kind === 'thunder'
        ? 'storms'
        : condition.kind === 'rain' || condition.kind === 'drizzle'
          ? 'rain'
          : 'precipitation'

  const nextTwelve = hourly.slice(0, 12)
  const maxChance = nextTwelve.length
    ? Math.max(...nextTwelve.map((hour) => hour.precipitationProbability))
    : 0
  const isWet = ['rain', 'drizzle', 'snow', 'thunder'].includes(condition.kind)
  const wetKinds = new Set(
    nextTwelve
      .filter((hour) => hour.precipitationProbability >= 25)
      .map((hour) => getCondition(hour.weatherCode).kind),
  )
  const likelyNoun = wetKinds.has('snow')
    ? 'Snow'
    : wetKinds.has('thunder')
      ? 'Storms'
      : 'Rain'

  let precipitation: string
  if (maxChance >= 55) {
    precipitation = `${likelyNoun} likely within 12 hours.`
  } else if (maxChance >= 25) {
    precipitation = `A chance of ${likelyNoun.toLowerCase()} later.`
  } else if (isWet) {
    precipitation = `${capitalize(noun)} easing.`
  } else {
    precipitation = 'No precipitation expected soon.'
  }

  const gustText =
    today.windGustMax >= 35 ? `, with gusts up to ${formatWind(today.windGustMax, unit)}` : ''

  return `${condition.label} now. ${precipitation} High ${formatTemperature(
    today.max,
    unit,
  )}, low ${formatTemperature(today.min, unit)}${gustText}.`
}

export function Hero({
  place,
  current,
  today,
  hourly,
  unit,
  updatedLabel,
  refreshing,
  onRefresh,
}: HeroProps) {
  const condition = getCondition(current.weatherCode)
  const secondary = placeSecondary(place)
  const summary = summarize(current, today, hourly, unit)

  return (
    <section
      className="panel panel-hero rise p-5 sm:p-7 lg:col-span-8"
      style={{ '--delay': '40ms' } as CSSProperties}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-white/75">
              <PinIcon className="size-3.5 shrink-0 text-[var(--accent)]" />
              <span className="truncate">{placeLabel(place)}</span>
              {secondary ? (
                <span className="hidden truncate text-white/30 sm:inline">· {secondary}</span>
              ) : null}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
              <span>{formatFullDate(current.time)}</span>
              <span className="size-1 rounded-full bg-white/20" />
              <span>{formatClock(current.time)}</span>
              <span className="text-white/20">local time</span>
            </p>
          </div>
          <span className="mt-0.5 shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
            {current.isDay ? 'Day' : 'Night'}
          </span>
        </div>

        <div className="mt-6 flex flex-1 flex-col-reverse items-start justify-center gap-4 sm:mt-7 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <div className="flex items-start">
              <span className="font-display text-[clamp(5.6rem,13vw,9.25rem)] leading-[0.78] tracking-[-0.055em] text-white">
                {formatTemperatureValue(current.temperature, unit)}
              </span>
              <span className="mt-1 font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-none text-white/70">
                °{unit.toUpperCase()}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-xl font-medium tracking-[-0.01em] text-white/90">{condition.label}</p>
              <span className="h-4 w-px bg-white/15" />
              <p className="text-[13px] text-white/50">
                Feels like {formatTemperature(current.feelsLike, unit)}
              </p>
            </div>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/45">{summary}</p>
          </div>

          <div className="relative flex shrink-0 items-center justify-center self-center sm:-mb-2 sm:self-auto">
            <div className="hero-halo absolute size-48 rounded-full opacity-80 sm:size-64" />
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              animated
              className="hero-weather relative size-28 sm:size-40 lg:size-44"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-4 text-[12px] text-white/55">
          <span className="inline-flex items-center gap-1.5">
            <ArrowUpIcon className="size-3.5 text-[var(--accent)]" />
            High {formatTemperature(today.max, unit)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ArrowDownIcon className="size-3.5 text-white/30" />
            Low {formatTemperature(today.min, unit)}
          </span>
          <span className="hidden items-center gap-1.5 text-white/30 sm:inline-flex">
            <ClockIcon className="size-3.5" />
            Updated {updatedLabel}
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 text-[11px] font-medium text-white/55 transition-colors hover:border-white/20 hover:text-white disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshIcon className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Updating' : 'Refresh'}
          </button>
        </div>
      </div>
    </section>
  )
}
