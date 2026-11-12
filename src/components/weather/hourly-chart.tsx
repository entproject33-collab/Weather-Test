'use client'

import { useId, useMemo, useState, type CSSProperties } from 'react'
import { formatHour, formatTemperature, type Unit } from '@/lib/format'
import { getCondition, type HourPoint } from '@/lib/weather'
import { CardHeading, ClockIcon } from './ui'

type HourlyChartProps = {
  hours: HourPoint[]
  unit: Unit
}

const COL = 44
const PAD = 14
const CHART_W = PAD * 2 + COL * 24
const CHART_H = 228
const PLOT_TOP = 44
const PLOT_BOTTOM = 142
const AREA_BOTTOM = 152
const BAR_BOTTOM = 196
const BAR_MAX = 26
const LABEL_Y = 222

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index]
    const p1 = points[index]
    const p2 = points[index + 1]
    const p3 = points[index + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(
      2,
    )}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return path
}

export function HourlyChart({ hours, unit }: HourlyChartProps) {
  const [hover, setHover] = useState<number | null>(null)
  const rawId = useId()
  const chartId = rawId.replace(/[^a-zA-Z0-9_-]/g, '')

  const chart = useMemo(() => {
    const temperatures = hours.map((hour) => hour.temperature)
    const rawMin = Math.min(...temperatures)
    const rawMax = Math.max(...temperatures)
    const padding = Math.max(1.5, (rawMax - rawMin) * 0.18)
    const minTemp = rawMin - padding
    const maxTemp = rawMax + padding

    const points = hours.map((hour, index) => ({
      x: PAD + index * COL + COL / 2,
      y:
        PLOT_TOP +
        ((maxTemp - hour.temperature) / (maxTemp - minTemp)) * (PLOT_BOTTOM - PLOT_TOP),
    }))

    const linePath = smoothPath(points)
    const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? PAD} ${AREA_BOTTOM} L ${
      points[0]?.x ?? PAD
    } ${AREA_BOTTOM} Z`

    const maxPrecip = Math.max(...hours.map((hour) => hour.precipitationProbability))
    const ariaSummary = `Temperatures between ${Math.round(rawMin)} and ${Math.round(
      rawMax,
    )} degrees, with up to ${maxPrecip}% chance of precipitation over the next 24 hours.`

    return { points, linePath, areaPath, ariaSummary }
  }, [hours])

  const selectedIndex = hover ?? 0
  const selected = hours[selectedIndex]
  const selectedCondition = selected ? getCondition(selected.weatherCode) : null

  if (hours.length === 0) return null

  return (
    <section
      className="panel rise p-5 sm:p-6 lg:col-span-12"
      style={{ '--delay': '170ms' } as CSSProperties}
    >
      <CardHeading
        icon={<ClockIcon className="size-3.5" />}
        trailing={
          hover !== null && selected ? (
            <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px]">
              <span className="font-medium text-white/75">{formatHour(selected.time)}</span>
              <span className="text-white/15">|</span>
              <span className="font-medium text-white/85">
                {formatTemperature(selected.temperature, unit)}
              </span>
              <span className="hidden text-white/40 sm:inline">{selectedCondition?.short}</span>
              <span className="text-sky-300/90">{selected.precipitationProbability}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">
              <span className="flex items-center gap-1.5">
                <span className="h-px w-4 bg-[var(--accent)]" />
                Temp
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-1.5 rounded-sm bg-sky-300/70" />
                Rain
              </span>
            </div>
          )
        }
      >
        Next 24 hours
      </CardHeading>

      <div className="no-scrollbar mt-4 overflow-x-auto">
        <svg          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="block h-auto w-full"
          style={{ minWidth: CHART_W }}
          role="img"
          aria-labelledby={`${chartId}-title ${chartId}-desc`}
          onPointerLeave={() => setHover(null)}
        >
          <title id={`${chartId}-title`}>Next 24 hours</title>
          <desc id={`${chartId}-desc`}>{chart.ariaSummary}</desc>

          <defs>
            <linearGradient id={`${chartId}-area`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--accent)' }} stopOpacity="0.22" />
              <stop offset="100%" style={{ stopColor: 'var(--accent)' }} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((fraction) => {
            const y = PLOT_TOP + fraction * (PLOT_BOTTOM - PLOT_TOP)
            return (
              <line
                key={fraction}
                x1={PAD}
                x2={CHART_W - PAD}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.045)"
                strokeDasharray="1 5"
              />
            )
          })}

          {hover !== null ? (
            <rect
              x={chart.points[hover].x - COL / 2}
              y={PLOT_TOP - 12}
              width={COL}
              height={BAR_BOTTOM - PLOT_TOP + 18}
              rx={10}
              fill="rgba(255,255,255,0.035)"
            />
          ) : null}

          <path d={chart.areaPath} fill={`url(#${chartId}-area)`} />
          <path
            d={chart.linePath}
            fill="none"
            style={{ stroke: 'var(--accent)' }}
            strokeOpacity="0.22"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={chart.linePath}
            fill="none"
            style={{ stroke: 'var(--accent)' }}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {hover !== null ? (
            <line
              x1={chart.points[hover].x}
              x2={chart.points[hover].x}
              y1={PLOT_TOP - 6}
              y2={BAR_BOTTOM}
              style={{ stroke: 'var(--accent)' }}
              strokeOpacity="0.25"
              strokeDasharray="2 5"
            />
          ) : null}

          {hours.map((hour, index) => {
            const x = chart.points[index].x
            const probability = hour.precipitationProbability
            const barHeight = probability === 0 ? 0 : Math.max(2, (probability / 100) * BAR_MAX)
            const isSelected = hover === index

            return (
              <g key={hour.time}>
                <rect
                  x={x - 7}
                  y={BAR_BOTTOM - BAR_MAX}
                  width={14}
                  height={BAR_MAX}
                  rx={3}
                  fill="rgba(255,255,255,0.04)"
                />
                <rect
                  x={x - 7}
                  y={BAR_BOTTOM - barHeight}
                  width={14}
                  height={barHeight}
                  rx={3}
                  fill={isSelected ? '#7dd3fc' : 'rgba(125,211,252,0.55)'}
                />

                {index % 3 === 0 ? (
                  <text
                    x={x}
                    y={LABEL_Y}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.35)"
                    fontSize="10.5"
                    fontWeight="500"
                  >
                    {index === 0 ? 'Now' : formatHour(hour.time)}
                  </text>
                ) : null}

                {index % 3 === 0 ? (
                  <circle
                    cx={x}
                    cy={chart.points[index].y}
                    r={2.2}
                    fill="rgba(255,255,255,0.45)"
                    stroke="#0a0e16"
                    strokeWidth="1"
                  />
                ) : null}

                <rect
                  x={x - COL / 2}
                  y={PLOT_TOP - 16}
                  width={COL}
                  height={BAR_BOTTOM - PLOT_TOP + 24}
                  fill="transparent"
                  onPointerEnter={() => setHover(index)}
                />
              </g>
            )
          })}

          {selected ? (
            <circle
              cx={chart.points[selectedIndex].x}
              cy={chart.points[selectedIndex].y}
              r={4.2}
              style={{ fill: 'var(--accent)' }}
              stroke="#0a0e16"
              strokeWidth="2"
              pointerEvents="none"
            />
          ) : null}

          {hours.map((hour, index) =>
            index % 3 === 0 ? (
              <text
                key={`temp-${hour.time}`}
                x={chart.points[index].x}
                y={Math.max(16, chart.points[index].y - 11)}
                textAnchor="middle"
                fill="rgba(255,255,255,0.62)"
                fontSize="10.5"
                fontWeight="500"
                pointerEvents="none"
              >
                {formatTemperature(hour.temperature, unit)}
              </text>
            ) : null,
          )}
        </svg>
      </div>

      <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.14em] text-white/25 lg:hidden">
        Scroll sideways for the full 24 hours →
      </p>

      <ul className="sr-only">
        {hours.map((hour) => (
          <li key={`sr-${hour.time}`}>
            {formatHour(hour.time)}: {formatTemperature(hour.temperature, unit)},{' '}
            {getCondition(hour.weatherCode).label}, {hour.precipitationProbability}% chance of
            precipitation.
          </li>
        ))}
      </ul>
    </section>
  )
}
