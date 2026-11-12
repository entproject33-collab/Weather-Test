import type { CSSProperties, ReactNode } from 'react'
import { clamp, getAqiInfo, type AirQuality } from '@/lib/weather'
import { CardHeading, WindIcon } from './ui'

type AirQualityCardProps = {
  air: AirQuality | null
}

function aqiDescription(aqi: number): string {
  if (aqi <= 50) return 'Air quality is good — a great day to spend time outside.'
  if (aqi <= 100) return 'Air quality is acceptable for most people.'
  if (aqi <= 150) return 'Sensitive groups may want to limit long outdoor activity.'
  if (aqi <= 200) return 'Consider reducing prolonged or heavy outdoor exertion.'
  if (aqi <= 300) return 'Avoid prolonged outdoor activity if you can.'
  return 'Stay indoors where possible and keep windows closed.'
}

function Pollutant({ label, value }: { label: ReactNode; value: number | null }) {
  return (
    <div>
      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/28">{label}</p>
      <p className="mt-1 text-[13px] font-medium tabular-nums text-white/70">
        {value === null ? '—' : value < 10 ? value.toFixed(1) : Math.round(value)}
        <span className="ml-1 text-[9px] font-normal text-white/25">µg/m³</span>
      </p>
    </div>
  )
}

export function AirQualityCard({ air }: AirQualityCardProps) {
  const aqi = air?.usAqi ?? null
  const info = aqi === null ? null : getAqiInfo(aqi)
  const marker = aqi === null ? 0 : clamp((aqi / 300) * 100, 2, 98)

  return (
    <section
      className="panel rise p-5 sm:p-6"
      style={{ '--delay': '350ms' } as CSSProperties}
    >
      <CardHeading
        icon={<WindIcon className="size-3.5" />}
        trailing={
          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/25">
            US AQI
          </span>
        }
      >
        Air quality
      </CardHeading>

      {aqi !== null && info ? (
        <>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-[38px] font-medium leading-none tracking-[-0.04em] text-white/90">
              {Math.round(aqi)}
            </p>
            <span
              className="mb-1 rounded-full px-2 py-1 text-[10px] font-semibold"
              style={{ color: info.color, backgroundColor: `${info.color}18` }}
            >
              {info.category}
            </span>
          </div>

          <div className="relative mt-4 h-1.5 rounded-full aqi-scale">
            <span
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e8edf5] bg-[#0b111c] shadow-[0_0_0_2px_rgba(0,0,0,0.35)]"
              style={{ left: `${marker}%` }}
            />
          </div>
          <p className="mt-2.5 text-[11px] leading-relaxed text-white/40">{aqiDescription(aqi)}</p>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3">
            <Pollutant
              label={
                <>
                  PM<sub>2.5</sub>
                </>
              }
              value={air?.pm25 ?? null}
            />
            <Pollutant label="PM10" value={air?.pm10 ?? null} />
            <Pollutant
              label={
                <>
                  O<sub>3</sub>
                </>
              }
              value={air?.ozone ?? null}
            />
          </div>
        </>
      ) : (
        <div className="mt-4 flex min-h-[150px] flex-col justify-center">
          <p className="text-sm text-white/60">Air quality data is unavailable right now.</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/30">
            The forecast above is still up to date.
          </p>
        </div>
      )}
    </section>
  )
}
