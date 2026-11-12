import { getCondition } from '@/lib/weather'

type WeatherIconProps = {
  code: number
  isDay?: boolean
  className?: string
  animated?: boolean
}

function Sun({ cx = 32, cy = 32, radius = 10.5, animated = false }: {
  cx?: number
  cy?: number
  radius?: number
  animated?: boolean
}) {
  const rays = [
    [0, -1],
    [0.71, -0.71],
    [1, 0],
    [0.71, 0.71],
    [0, 1],
    [-0.71, 0.71],
    [-1, 0],
    [-0.71, -0.71],
  ]
  const inner = radius + 4
  const outer = radius + 8.5

  return (
    <g className="text-[var(--accent)]">
      <circle cx={cx} cy={cy} r={radius + 4} fill="currentColor" opacity="0.1" />
      <g
        className={animated ? 'sun-rays' : undefined}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        {rays.map(([dx, dy], index) => (
          <line
            key={index}
            x1={cx + dx * inner}
            y1={cy + dy * inner}
            x2={cx + dx * outer}
            y2={cy + dy * outer}
          />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={radius} fill="currentColor" />
    </g>
  )
}

function Moon({ className = 'text-[var(--accent)]' }: { className?: string }) {
  return (
    <g className={className}>
      <circle cx="36" cy="30" r="19" fill="currentColor" opacity="0.1" />
      <path
        d="M40 10a18.5 18.5 0 1 0 14 30.5A21.5 21.5 0 0 1 40 10Z"
        fill="currentColor"
      />
      <circle cx="16" cy="17" r="1.1" fill="currentColor" opacity="0.55" />
      <circle cx="23" cy="30" r="0.8" fill="currentColor" opacity="0.4" />
    </g>
  )
}

function Cloud({
  className = 'text-slate-100',
  transform,
  opacity = 1,
}: {
  className?: string
  transform?: string
  opacity?: number
}) {
  return (
    <path
      d="M20 46a8 8 0 0 1-1.8-15.8A12 12 0 0 1 42 27.4a8.5 8.5 0 0 1 2 16.6H20Z"
      fill="currentColor"
      opacity={opacity}
      transform={transform}
      className={className}
    />
  )
}

function Drops({ heavy = false, kind = 'rain' }: { heavy?: boolean; kind?: 'rain' | 'drizzle' }) {
  const x = heavy ? [23, 31, 39, 47] : [25, 33, 41]
  return (
    <g className="precip-drops text-sky-300" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      {x.map((dropX, index) => (
        <line
          key={dropX}
          x1={dropX}
          y1={kind === 'drizzle' ? 48 : 46}
          x2={dropX - 1.5}
          y2={kind === 'drizzle' ? 51 : 53}
          className="drop"
          style={{ animationDelay: `${index * 130}ms` }}
        />
      ))}
    </g>
  )
}

function Snow() {
  return (
    <g className="text-sky-100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <g transform="translate(25 48) scale(0.55)">
        <path d="M0-6v12M-5.2-3 5.2 3M-5.2 3 5.2-3" />
      </g>
      <g transform="translate(35 53) scale(0.45)">
        <path d="M0-6v12M-5.2-3 5.2 3M-5.2 3 5.2-3" />
      </g>
      <g transform="translate(44 47) scale(0.5)">
        <path d="M0-6v12M-5.2-3 5.2 3M-5.2 3 5.2-3" />
      </g>
    </g>
  )
}

export function WeatherIcon({ code, isDay = true, className = 'size-10', animated = false }: WeatherIconProps) {
  const condition = getCondition(code)

  let content

  switch (condition.kind) {
    case 'clear':
      content = isDay ? <Sun animated={animated} /> : <Moon />
      break
    case 'partly':
      content = isDay ? (
        <>
          <Sun cx={21} cy={20} radius={7.5} animated={animated} />
          <g className={animated ? 'cloud-float' : undefined}>
            <Cloud transform="translate(1 5)" />
          </g>
        </>
      ) : (
        <>
          <g transform="translate(-9 -5) scale(0.8)">
            <Moon />
          </g>
          <g className={animated ? 'cloud-float' : undefined}>
            <Cloud transform="translate(1 5)" />
          </g>
        </>
      )
      break
    case 'fog':
      content = (
        <>
          <g className={animated ? 'cloud-float' : undefined}>
            <Cloud transform="translate(0 -5)" />
          </g>
          <g className="text-white/45" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="14" y1="47" x2="50" y2="47" />
            <line x1="20" y1="52.5" x2="44" y2="52.5" />
            <line x1="16" y1="58" x2="48" y2="58" />
          </g>
        </>
      )
      break
    case 'drizzle':
      content = (
        <>
          <g className={animated ? 'cloud-float' : undefined}>
            <Cloud transform="translate(0 -5)" />
          </g>
          <Drops kind="drizzle" />
        </>
      )
      break
    case 'rain':
      content = (
        <>
          <g className={animated ? 'cloud-float' : undefined}>
            <Cloud transform="translate(0 -5)" />
          </g>
          <Drops heavy={code >= 63} />
        </>
      )
      break
    case 'snow':
      content = (
        <>
          <g className={animated ? 'cloud-float' : undefined}>
            <Cloud transform="translate(0 -5)" />
          </g>
          <Snow />
        </>
      )
      break
    case 'thunder':
      content = (
        <>
          <g className={animated ? 'cloud-float' : undefined}>
            <Cloud transform="translate(0 -7)" />
          </g>
          <path
            d="M33.5 40 27 52h6l-2.5 9L41 48h-6l3.5-8Z"
            className="text-amber-300"
            fill="currentColor"
          />
        </>
      )
      break
    default:
      content = (
        <>
          <g transform="translate(-7 -6) scale(0.72)" className="text-white/25">
            <Cloud />
          </g>
          <g className={animated ? 'cloud-float' : undefined}>
            <Cloud transform="translate(2 3)" />
          </g>
        </>
      )
  }

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`weather-icon ${className}`}
      data-weather={condition.kind}
      data-animated={animated ? 'true' : undefined}
    >
      {content}
    </svg>
  )
}
