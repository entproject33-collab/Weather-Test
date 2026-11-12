import type { ReactNode, SVGProps } from 'react'
import type { Unit } from '@/lib/format'

export type IconProps = SVGProps<SVGSVGElement>

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </IconBase>
  )
}

export function LocateIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
    </IconBase>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 11.5a8 8 0 1 0-2.34 6.16" />
      <path d="M20 4.5v7h-7" />
    </IconBase>
  )
}

export function PinIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </IconBase>
  )
}

export function ThermometerIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z" />
      <path d="M12 8v7" />
    </IconBase>
  )
}

export function DropletIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 2.8 7.1 8.1a7 7 0 1 0 9.8 0L12 2.8Z" />
    </IconBase>
  )
}

export function WindIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 8h10.5a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12h15.5a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16h6.5" />
    </IconBase>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </IconBase>
  )
}

export function GaugeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20.37 16.5a9 9 0 1 0-16.74 0" />
      <path d="m12 13.5 3.5-3.5" />
      <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </IconBase>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20.7 13.2A8.7 8.7 0 1 1 10.8 3.3a7 7 0 0 0 9.9 9.9Z" />
    </IconBase>
  )
}

export function CloudIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 18.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.4 4.6 4.6 0 0 0 7 18.5Z" />
    </IconBase>
  )
}

export function SunriseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2.5 19h19" />
      <path d="M5 15.5a7 7 0 0 1 14 0" />
      <path d="M12 2.5v3M4.2 8.2l1.8 1.8M19.8 8.2 18 10" />
    </IconBase>
  )
}

export function SunsetIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2.5 19h19" />
      <path d="M5 15.5a7 7 0 0 1 14 0" />
      <path d="M12 2.5v3M4.2 8.2l1.8 1.8M19.8 8.2 18 10" />
      <path d="M12 12v6M9 15l3 3 3-3" />
    </IconBase>
  )
}

export function NavigationIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
    </IconBase>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </IconBase>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </IconBase>
  )
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
    </IconBase>
  )
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M6.5 13.5 12 19l5.5-5.5" />
    </IconBase>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <circle cx="12" cy="16.5" r=".8" fill="currentColor" stroke="none" />
    </IconBase>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  )
}

export function ExternalIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </IconBase>
  )
}

export function CompassIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </IconBase>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="3.4" className="fill-[var(--accent)]" />
          <circle
            cx="12"
            cy="12"
            r="7.3"
            stroke="currentColor"
            strokeOpacity="0.32"
            strokeWidth="1"
            strokeDasharray="1.5 2.6"
            className="text-white"
          />
          <circle cx="18.9" cy="5.6" r="1.15" className="fill-white/70" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block text-[12px] font-semibold tracking-[0.3em] text-white">SKYLINE</span>
        <span className="mt-1.5 block text-[9px] font-medium uppercase tracking-[0.22em] text-white/35">
          Weather
        </span>
      </span>
    </div>
  )
}

export function UnitToggle({
  unit,
  onChange,
}: {
  unit: Unit
  onChange: (unit: Unit) => void
}) {
  return (
    <div
      role="group"
      aria-label="Temperature units"
      className="relative flex shrink-0 rounded-full border border-white/10 bg-white/[0.035] p-1"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[var(--accent)] shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out"
        style={{ transform: unit === 'f' ? 'translateX(100%)' : 'translateX(0)' }}
      />
      {(['c', 'f'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={unit === option}
          className={`relative z-10 min-w-10 rounded-full px-2 py-1.5 text-[11px] font-semibold transition-colors ${
            unit === option ? 'text-[#080b12]' : 'text-white/50 hover:text-white'
          }`}
        >
          °{option.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export function CardHeading({
  icon,
  children,
  trailing,
}: {
  icon?: ReactNode
  children: ReactNode
  trailing?: ReactNode
}) {
  return (
    <div className="flex min-h-5 items-center justify-between gap-4">
      <h2 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
        {icon ? <span className="text-white/30">{icon}</span> : null}
        {children}
      </h2>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  )
}
