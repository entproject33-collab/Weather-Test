import { parseLocalDateParts } from './weather'

export type Unit = 'c' | 'f'

const WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function weekdayIndex(iso: string): number {
  const { year, month, day } = parseLocalDateParts(iso)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

export function convertTemperature(celsius: number, unit: Unit): number {
  return unit === 'f' ? (celsius * 9) / 5 + 32 : celsius
}

export function formatTemperature(celsius: number, unit: Unit): string {
  return `${Math.round(convertTemperature(celsius, unit))}°`
}

export function formatTemperatureValue(celsius: number, unit: Unit): string {
  return `${Math.round(convertTemperature(celsius, unit))}`
}

export function unitSymbol(unit: Unit): string {
  return unit === 'f' ? '°F' : '°C'
}

export function formatWind(kmh: number, unit: Unit): string {
  return unit === 'f' ? `${Math.round(kmh * 0.621371)} mph` : `${Math.round(kmh)} km/h`
}

export function formatWindValue(kmh: number, unit: Unit): string {
  return unit === 'f' ? `${Math.round(kmh * 0.621371)}` : `${Math.round(kmh)}`
}

export function windUnit(unit: Unit): string {
  return unit === 'f' ? 'mph' : 'km/h'
}

export function formatVisibility(meters: number | null, unit: Unit): string {
  if (meters === null || !Number.isFinite(meters)) return '—'
  if (unit === 'f') {
    const miles = meters / 1609.344
    if (miles >= 10) return '10+ mi'
    if (miles < 1) return `${Math.round(miles * 10) / 10} mi`
    return `${miles.toFixed(1)} mi`
  }
  const km = meters / 1000
  if (km >= 20) return '20+ km'
  return `${km.toFixed(1)} km`
}

export function formatPressure(hpa: number, unit: Unit): string {
  if (unit === 'f') return `${(hpa * 0.02953).toFixed(2)} inHg`
  return `${Math.round(hpa)} hPa`
}

export function formatPrecipitation(mm: number, unit: Unit): string {
  if (unit === 'f') {
    const inches = mm / 25.4
    if (inches === 0) return '0 in'
    return `${inches < 0.01 ? '<0.01' : inches.toFixed(2)} in`
  }
  if (mm === 0) return '0 mm'
  return `${mm < 0.1 ? '<0.1' : mm.toFixed(1)} mm`
}

export function formatFullDate(iso: string): string {
  const { month, day } = parseLocalDateParts(iso)
  return `${WEEKDAYS_LONG[weekdayIndex(iso)]}, ${MONTHS_LONG[month - 1]} ${day}`
}

export function formatDayName(iso: string, index: number): string {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'
  return WEEKDAYS_LONG[weekdayIndex(iso)]
}

export function formatDayNameShort(iso: string, index: number): string {
  if (index === 0) return 'Today'
  return WEEKDAYS_SHORT[weekdayIndex(iso)]
}

export function formatShortDate(iso: string): string {
  const { month, day } = parseLocalDateParts(iso)
  return `${MONTHS_SHORT[month - 1]} ${day}`
}

export function formatClock(iso: string, use24Hour = false): string {
  const { hour, minute } = parseLocalDateParts(iso)
  const safeMinute = Number.isFinite(minute) ? minute : 0
  if (use24Hour) {
    return `${String(hour).padStart(2, '0')}:${String(safeMinute).padStart(2, '0')}`
  }
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(safeMinute).padStart(2, '0')} ${period}`
}

export function formatHour(iso: string): string {
  const { hour } = parseLocalDateParts(iso)
  const period = hour >= 12 ? 'PM' : 'AM'
  return `${hour % 12 || 12} ${period}`
}

export function formatHourCompact(iso: string): string {
  const { hour } = parseLocalDateParts(iso)
  if (hour === 0) return '12a'
  if (hour === 12) return '12p'
  return `${hour % 12}${hour < 12 ? 'a' : 'p'}`
}

export function formatDaylight(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return '—'
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

export function minutesIntoDay(iso: string): number {
  const { hour, minute } = parseLocalDateParts(iso)
  return hour * 60 + minute
}

export function formatDurationMinutes(totalMinutes: number): string {
  const safe = Math.max(0, Math.round(totalMinutes))
  const hours = Math.floor(safe / 60)
  const minutes = safe % 60
  if (hours === 0) return `${minutes}m`
  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

export function formatRelativeTime(iso: string, now: number): string {
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return 'just now'
  const minutes = Math.max(0, Math.floor((now - then) / 60_000))
  if (minutes < 1) return 'just now'
  if (minutes === 1) return '1 min ago'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return '1 hr ago'
  return `${hours} hrs ago`
}
