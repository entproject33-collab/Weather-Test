import type { CSSProperties, ReactNode } from 'react'
import {
  formatPressure,
  formatTemperature,
  formatVisibility,
  formatWind,
  windUnit,
  type Unit,
} from '@/lib/format'
import {
  clamp,
  directionToCompass,
  getUvLabel,
  type CurrentConditions,
  type DayForecast,
} from '@/lib/weather'
import { CardHeading, CloudIcon, CompassIcon, DropletIcon, EyeIcon, GaugeIcon, SunIcon, ThermometerIcon, WindIcon, ArrowUpIcon } from './ui'

type DetailsProps = {
  current: CurrentConditions
  today: DayForecast
  unit: Unit
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  children,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="flex min-h-[104px] flex-col rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
          {label}
        </span>
        <span className="text-white/25">{icon}</span>
      </div>
      <p className="mt-2 text-[22px] font-medium leading-none tracking-[-0.02em] text-white/90">
        {value}
      </p>
      <div className="mt-auto pt-2 text-[10px] leading-snug text-white/35">{detail}</div>
      {children}
    </div>
  )
}

function SmallMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">
        <span className="text-white/20">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1.5 text-[13px] font-medium text-white/75">{value}</dd>
    </div>
  )
}

export function CurrentDetails({ current, today, unit }: DetailsProps) {
  const uv = current.uvIndex
  const uvPercent = uv === null ? 0 : clamp((uv / 11) * 100, 3, 97)
  const compass = directionToCompass(current.windDirection)

  return (
    <aside
      className="panel rise flex flex-col p-5 sm:p-6 lg:col-span-4"
      style={{ '--delay': '110ms' } as CSSProperties}
    >
      <CardHeading icon={<CompassIcon className="size-3.5" />}>
        Current conditions
      </CardHeading>

      <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-4 lg:grid-cols-2">
        <MetricCard
          icon={<ThermometerIcon className="size-3.5" />}
          label="Feels like"
          value={formatTemperature(current.feelsLike, unit)}
          detail={`Air ${formatTemperature(current.temperature, unit)} · high ${formatTemperature(today.max, unit)}`}
        />
        <MetricCard
          icon={<DropletIcon className="size-3.5" />}
          label="Humidity"
          value={`${Math.round(current.humidity)}%`}
          detail={
            current.dewPoint === null
              ? 'Relative humidity'
              : `Dew point ${formatTemperature(current.dewPoint, unit)}`
          }
        >
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${clamp(current.humidity, 0, 100)}%` }}
            />
          </div>
        </MetricCard>
        <MetricCard
          icon={<WindIcon className="size-3.5" />}
          label="Wind"
          value={formatWind(current.windSpeed, unit)}
          detail={`${compass} · gusts ${Math.round(
            unit === 'f' ? current.windGust * 0.621371 : current.windGust,
          )} ${windUnit(unit)}`}
        >
          <div className="mt-2 flex items-center gap-1.5 text-white/30">
            <span className="grid size-5 place-items-center rounded-full border border-white/[0.08]">
              <ArrowUpIcon
                className="size-3 text-white/55"
                style={{ transform: `rotate(${current.windDirection + 180}deg)` }}
              />
            </span>
            <span className="text-[9px] uppercase tracking-[0.12em]">Wind direction</span>
          </div>
        </MetricCard>
        <MetricCard
          icon={<SunIcon className="size-3.5" />}
          label="UV index"
          value={uv === null ? '—' : uv.toFixed(1)}
          detail={uv === null ? 'Not available' : `${getUvLabel(uv)} · max ${today.uvIndexMax?.toFixed(1) ?? '—'}`}
        >
          <div className="relative mt-2 h-1 rounded-full uv-scale">
            <span
              className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-[#0b111c]"
              style={{ left: `${uvPercent}%` }}
            />
          </div>
        </MetricCard>
      </div>

      <div className="hairline my-5" />

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 lg:grid-cols-2">
        <SmallMetric
          icon={<EyeIcon className="size-3" />}
          label="Visibility"
          value={formatVisibility(current.visibility, unit)}
        />
        <SmallMetric
          icon={<GaugeIcon className="size-3" />}
          label="Pressure"
          value={formatPressure(current.pressure, unit)}
        />
        <SmallMetric
          icon={<DropletIcon className="size-3" />}
          label="Dew point"
          value={
            current.dewPoint === null ? '—' : formatTemperature(current.dewPoint, unit)
          }
        />
        <SmallMetric
          icon={<CloudIcon className="size-3" />}
          label="Cloud cover"
          value={`${Math.round(current.cloudCover)}%`}
        />
      </dl>
    </aside>
  )
}
