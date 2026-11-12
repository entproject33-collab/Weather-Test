export type Place = {
  name: string
  region?: string
  country?: string
  countryCode?: string
  latitude: number
  longitude: number
}

export type CurrentConditions = {
  /** Local time at the location, without an offset. */
  time: string
  temperature: number
  feelsLike: number
  humidity: number
  dewPoint: number | null
  isDay: boolean
  precipitation: number
  weatherCode: number
  cloudCover: number
  pressure: number
  windSpeed: number
  windDirection: number
  windGust: number
  uvIndex: number | null
  visibility: number | null
}

export type HourPoint = {
  time: string
  temperature: number
  feelsLike: number
  precipitationProbability: number
  precipitation: number
  weatherCode: number
  windSpeed: number
  humidity: number
  uvIndex: number
  visibility: number
}

export type DayForecast = {
  date: string
  weatherCode: number
  max: number
  min: number
  apparentMax: number
  apparentMin: number
  sunrise: string | null
  sunset: string | null
  daylightSeconds: number | null
  uvIndexMax: number | null
  precipitationSum: number
  precipitationProbabilityMax: number
  windMax: number
  windGustMax: number
  windDirection: number
}

export type AirQuality = {
  time: string
  usAqi: number | null
  europeanAqi: number | null
  pm25: number | null
  pm10: number | null
  ozone: number | null
  nitrogenDioxide: number | null
  sulphurDioxide: number | null
  carbonMonoxide: number | null
}

export type WeatherSnapshot = {
  timezone: string
  timezoneAbbreviation: string
  utcOffsetSeconds: number
  current: CurrentConditions
  /** The next 24 hours, beginning with the current hour. */
  hourly: HourPoint[]
  daily: DayForecast[]
  air: AirQuality | null
  fetchedAt: string
}

export type WeatherResponse = {
  place: Place
  weather: WeatherSnapshot
}

export type GeocodeResult = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
  countryCode?: string
  timezone?: string
}

export type ConditionKind =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunder'

export type Condition = {
  label: string
  short: string
  kind: ConditionKind
}

const CONDITIONS: Record<number, Condition> = {
  0: { label: 'Clear sky', short: 'Clear', kind: 'clear' },
  1: { label: 'Mainly clear', short: 'Mostly clear', kind: 'clear' },
  2: { label: 'Partly cloudy', short: 'Partly cloudy', kind: 'partly' },
  3: { label: 'Overcast', short: 'Overcast', kind: 'cloudy' },
  45: { label: 'Fog', short: 'Fog', kind: 'fog' },
  48: { label: 'Icy fog', short: 'Icy fog', kind: 'fog' },
  51: { label: 'Light drizzle', short: 'Drizzle', kind: 'drizzle' },
  53: { label: 'Moderate drizzle', short: 'Drizzle', kind: 'drizzle' },
  55: { label: 'Dense drizzle', short: 'Drizzle', kind: 'drizzle' },
  56: { label: 'Freezing drizzle', short: 'Icy drizzle', kind: 'drizzle' },
  57: { label: 'Heavy freezing drizzle', short: 'Icy drizzle', kind: 'drizzle' },
  61: { label: 'Light rain', short: 'Light rain', kind: 'rain' },
  63: { label: 'Moderate rain', short: 'Rain', kind: 'rain' },
  65: { label: 'Heavy rain', short: 'Heavy rain', kind: 'rain' },
  66: { label: 'Freezing rain', short: 'Icy rain', kind: 'rain' },
  67: { label: 'Heavy freezing rain', short: 'Icy rain', kind: 'rain' },
  71: { label: 'Light snow', short: 'Light snow', kind: 'snow' },
  73: { label: 'Moderate snow', short: 'Snow', kind: 'snow' },
  75: { label: 'Heavy snow', short: 'Heavy snow', kind: 'snow' },
  77: { label: 'Snow grains', short: 'Snow', kind: 'snow' },
  80: { label: 'Light rain showers', short: 'Showers', kind: 'rain' },
  81: { label: 'Moderate rain showers', short: 'Showers', kind: 'rain' },
  82: { label: 'Violent rain showers', short: 'Heavy showers', kind: 'rain' },
  85: { label: 'Light snow showers', short: 'Snow showers', kind: 'snow' },
  86: { label: 'Heavy snow showers', short: 'Snow showers', kind: 'snow' },
  95: { label: 'Thunderstorm', short: 'Storm', kind: 'thunder' },
  96: { label: 'Thunderstorm with hail', short: 'Hail storm', kind: 'thunder' },
  99: { label: 'Severe thunderstorm with hail', short: 'Hail storm', kind: 'thunder' },
}

export function getCondition(code: number): Condition {
  return (
    CONDITIONS[code] ?? {
      label: 'Unknown conditions',
      short: 'Unknown',
      kind: 'cloudy',
    }
  )
}

export type WeatherTheme = {
  key: string
  accent: string
  accentSoft: string
  glowOne: string
  glowTwo: string
  stars: boolean
}

const THEMES: Record<string, WeatherTheme> = {
  'clear-day': {
    key: 'clear-day',
    accent: '#ffc46b',
    accentSoft: '#ff9e4a',
    glowOne: 'rgba(255, 158, 74, 0.20)',
    glowTwo: 'rgba(56, 189, 248, 0.10)',
    stars: false,
  },
  'clear-night': {
    key: 'clear-night',
    accent: '#a5b4fc',
    accentSoft: '#818cf8',
    glowOne: 'rgba(99, 102, 241, 0.21)',
    glowTwo: 'rgba(168, 85, 247, 0.09)',
    stars: true,
  },
  'partly-day': {
    key: 'partly-day',
    accent: '#ffd08a',
    accentSoft: '#8dd3f7',
    glowOne: 'rgba(255, 184, 97, 0.17)',
    glowTwo: 'rgba(56, 189, 248, 0.13)',
    stars: false,
  },
  'partly-night': {
    key: 'partly-night',
    accent: '#b9c6ff',
    accentSoft: '#7dd3fc',
    glowOne: 'rgba(99, 102, 241, 0.18)',
    glowTwo: 'rgba(14, 165, 233, 0.09)',
    stars: true,
  },
  cloudy: {
    key: 'cloudy',
    accent: '#c2d1e0',
    accentSoft: '#7dd3fc',
    glowOne: 'rgba(148, 163, 184, 0.16)',
    glowTwo: 'rgba(56, 189, 248, 0.07)',
    stars: false,
  },
  fog: {
    key: 'fog',
    accent: '#cbd5e1',
    accentSoft: '#94a3b8',
    glowOne: 'rgba(148, 163, 184, 0.15)',
    glowTwo: 'rgba(120, 143, 166, 0.08)',
    stars: false,
  },
  rain: {
    key: 'rain',
    accent: '#7dd3fc',
    accentSoft: '#34d399',
    glowOne: 'rgba(14, 165, 233, 0.18)',
    glowTwo: 'rgba(45, 212, 191, 0.08)',
    stars: false,
  },
  snow: {
    key: 'snow',
    accent: '#dbeafe',
    accentSoft: '#93c5fd',
    glowOne: 'rgba(147, 197, 253, 0.16)',
    glowTwo: 'rgba(224, 242, 254, 0.08)',
    stars: false,
  },
  thunder: {
    key: 'thunder',
    accent: '#d8b4fe',
    accentSoft: '#fbbf24',
    glowOne: 'rgba(168, 85, 247, 0.20)',
    glowTwo: 'rgba(251, 191, 36, 0.07)',
    stars: false,
  },
}

export function getTheme(code: number, isDay: boolean): WeatherTheme {
  const { kind } = getCondition(code)
  if (kind === 'clear') return THEMES[isDay ? 'clear-day' : 'clear-night']
  if (kind === 'partly') return THEMES[isDay ? 'partly-day' : 'partly-night']
  return THEMES[kind] ?? THEMES.cloudy
}

export const DEFAULT_PLACE: Place = {
  name: 'Boston',
  region: 'Massachusetts',
  country: 'United States',
  countryCode: 'US',
  latitude: 42.3584,
  longitude: -71.0598,
}

export function placeLabel(place: Place): string {
  if (place.region && place.region !== place.name) {
    return `${place.name}, ${place.region}`
  }
  return place.name
}

export function placeSecondary(place: Place): string {
  if (!place.country) {
    return `${Math.abs(place.latitude).toFixed(2)}° ${place.latitude >= 0 ? 'N' : 'S'} · ${Math.abs(
      place.longitude,
    ).toFixed(2)}° ${place.longitude >= 0 ? 'E' : 'W'}`
  }
  if (place.region && place.country === place.region) return ''
  return place.country
}

export function countryFlag(countryCode?: string): string | null {
  if (!countryCode || !/^[a-z]{2}$/i.test(countryCode)) return null
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0)),
  )
}

const COMPASS_POINTS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
]

export function directionToCompass(degrees: number): string {
  const index = Math.round(((degrees % 360) / 360) * 16) % 16
  return COMPASS_POINTS[index]
}

export function getUvLabel(uv: number): string {
  if (uv < 0.5) return 'Low'
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very high'
  return 'Extreme'
}

export type AqiInfo = {
  category: string
  color: string
  short: string
}

export function getAqiInfo(aqi: number): AqiInfo {
  if (aqi <= 50) return { category: 'Good', short: 'Good', color: '#4ade80' }
  if (aqi <= 100) return { category: 'Moderate', short: 'Moderate', color: '#facc15' }
  if (aqi <= 150) {
    return { category: 'Unhealthy for sensitive groups', short: 'Sensitive groups', color: '#fb923c' }
  }
  if (aqi <= 200) return { category: 'Unhealthy', short: 'Unhealthy', color: '#f87171' }
  if (aqi <= 300) return { category: 'Very unhealthy', short: 'Very unhealthy', color: '#c084fc' }
  return { category: 'Hazardous', short: 'Hazardous', color: '#fb7185' }
}

export function parseLocalDateParts(iso: string): {
  year: number
  month: number
  day: number
  hour: number
  minute: number
} {
  const [datePart, timePart = '00:00'] = iso.split('T')
  const [year, month, day] = datePart.split('-').map((part) => Number(part))
  const [hour, minute] = timePart.split(':').map((part) => Number(part))
  return { year, month, day, hour, minute }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
