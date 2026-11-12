import { cacheLife } from 'next/cache'
import {
  roundTo,
  type AirQuality,
  type CurrentConditions,
  type DayForecast,
  type HourPoint,
  type WeatherSnapshot,
} from './weather'

const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'
const AIR_ENDPOINT = 'https://air-quality-api.open-meteo.com/v1/air-quality'

const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'dew_point_2m',
  'is_day',
  'precipitation',
  'weather_code',
  'cloud_cover',
  'pressure_msl',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
].join(',')

const HOURLY_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'relative_humidity_2m',
  'uv_index',
  'visibility',
].join(',')

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'sunrise',
  'sunset',
  'daylight_duration',
  'uv_index_max',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'wind_direction_10m_dominant',
].join(',')

const AIR_FIELDS = [
  'us_aqi',
  'european_aqi',
  'pm2_5',
  'pm10',
  'ozone',
  'nitrogen_dioxide',
  'sulphur_dioxide',
  'carbon_monoxide',
].join(',')

type RawForecast = {
  timezone: string
  timezone_abbreviation: string
  utc_offset_seconds: number
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    dew_point_2m: number | null
    is_day: number
    precipitation: number
    weather_code: number
    cloud_cover: number
    pressure_msl: number
    wind_speed_10m: number
    wind_direction_10m: number
    wind_gusts_10m: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    apparent_temperature: number[]
    precipitation_probability: number[]
    precipitation: number[]
    weather_code: number[]
    wind_speed_10m: number[]
    relative_humidity_2m: number[]
    uv_index: number[]
    visibility: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    apparent_temperature_max: number[]
    apparent_temperature_min: number[]
    sunrise: (string | null)[]
    sunset: (string | null)[]
    daylight_duration: (number | null)[]
    uv_index_max: (number | null)[]
    precipitation_sum: number[]
    precipitation_probability_max: number[]
    wind_speed_10m_max: number[]
    wind_gusts_10m_max: number[]
    wind_direction_10m_dominant: number[]
  }
}

type RawAir = {
  current: {
    time: string
    us_aqi: number | null
    european_aqi: number | null
    pm2_5: number | null
    pm10: number | null
    ozone: number | null
    nitrogen_dioxide: number | null
    sulphur_dioxide: number | null
    carbon_monoxide: number | null
  }
}

async function fetchJson<T>(url: string, label: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`${label} request failed with ${response.status}`)
  }

  return (await response.json()) as T
}

export function normalizeCoordinates(latitude: number, longitude: number) {
  return {
    latitude: roundTo(latitude, 3),
    longitude: roundTo(longitude, 3),
  }
}

function buildForecastUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS,
    hourly: HOURLY_FIELDS,
    daily: DAILY_FIELDS,
    timezone: 'auto',
    forecast_days: '7',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  })

  return `${FORECAST_ENDPOINT}?${params.toString()}`
}

function buildAirUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: AIR_FIELDS,
    timezone: 'auto',
  })

  return `${AIR_ENDPOINT}?${params.toString()}`
}

function normalizeAir(raw: RawAir | null): AirQuality | null {
  if (!raw?.current) return null

  const { current } = raw
  return {
    time: current.time,
    usAqi: current.us_aqi,
    europeanAqi: current.european_aqi,
    pm25: current.pm2_5,
    pm10: current.pm10,
    ozone: current.ozone,
    nitrogenDioxide: current.nitrogen_dioxide,
    sulphurDioxide: current.sulphur_dioxide,
    carbonMonoxide: current.carbon_monoxide,
  }
}

/**
 * Fetch and normalize everything the dashboard needs for a coordinate pair.
 * Coordinates are cached at ~100 m precision and refreshed once a minute.
 */
export async function getWeatherBundle(
  latitude: number,
  longitude: number,
): Promise<WeatherSnapshot> {
  'use cache'
  cacheLife('minutes')

  const lat = roundTo(latitude, 3)
  const lon = roundTo(longitude, 3)

  const [forecastResult, airResult] = await Promise.allSettled([
    fetchJson<RawForecast>(buildForecastUrl(lat, lon), 'Forecast'),
    fetchJson<RawAir>(buildAirUrl(lat, lon), 'Air quality'),
  ])

  if (forecastResult.status === 'rejected') {
    throw new Error('The weather service is unavailable right now.')
  }

  const raw = forecastResult.value
  const currentHour = `${raw.current.time.slice(0, 13)}:00`
  let startIndex = raw.hourly.time.findIndex((time) => time >= currentHour)
  if (startIndex < 0) startIndex = 0

  const current: CurrentConditions = {
    time: raw.current.time,
    temperature: raw.current.temperature_2m,
    feelsLike: raw.current.apparent_temperature,
    humidity: raw.current.relative_humidity_2m,
    dewPoint: raw.current.dew_point_2m,
    isDay: raw.current.is_day === 1,
    precipitation: raw.current.precipitation,
    weatherCode: raw.current.weather_code,
    cloudCover: raw.current.cloud_cover,
    pressure: raw.current.pressure_msl,
    windSpeed: raw.current.wind_speed_10m,
    windDirection: raw.current.wind_direction_10m,
    windGust: raw.current.wind_gusts_10m,
    uvIndex: raw.hourly.uv_index[startIndex] ?? null,
    visibility: raw.hourly.visibility[startIndex] ?? null,
  }

  const hourly: HourPoint[] = []
  for (let index = startIndex; index < raw.hourly.time.length && hourly.length < 24; index += 1) {
    hourly.push({
      time: raw.hourly.time[index],
      temperature: raw.hourly.temperature_2m[index] ?? current.temperature,
      feelsLike: raw.hourly.apparent_temperature[index] ?? current.feelsLike,
      precipitationProbability: raw.hourly.precipitation_probability[index] ?? 0,
      precipitation: raw.hourly.precipitation[index] ?? 0,
      weatherCode: raw.hourly.weather_code[index] ?? current.weatherCode,
      windSpeed: raw.hourly.wind_speed_10m[index] ?? current.windSpeed,
      humidity: raw.hourly.relative_humidity_2m[index] ?? current.humidity,
      uvIndex: raw.hourly.uv_index[index] ?? 0,
      visibility: raw.hourly.visibility[index] ?? 0,
    })
  }

  const daily: DayForecast[] = raw.daily.time.map((date, index) => ({
    date,
    weatherCode: raw.daily.weather_code[index] ?? 0,
    max: raw.daily.temperature_2m_max[index] ?? current.temperature,
    min: raw.daily.temperature_2m_min[index] ?? current.temperature,
    apparentMax: raw.daily.apparent_temperature_max[index] ?? current.feelsLike,
    apparentMin: raw.daily.apparent_temperature_min[index] ?? current.feelsLike,
    sunrise: raw.daily.sunrise[index] ?? null,
    sunset: raw.daily.sunset[index] ?? null,
    daylightSeconds: raw.daily.daylight_duration[index] ?? null,
    uvIndexMax: raw.daily.uv_index_max[index] ?? null,
    precipitationSum: raw.daily.precipitation_sum[index] ?? 0,
    precipitationProbabilityMax: raw.daily.precipitation_probability_max[index] ?? 0,
    windMax: raw.daily.wind_speed_10m_max[index] ?? 0,
    windGustMax: raw.daily.wind_gusts_10m_max[index] ?? 0,
    windDirection: raw.daily.wind_direction_10m_dominant[index] ?? 0,
  }))

  return {
    timezone: raw.timezone,
    timezoneAbbreviation: raw.timezone_abbreviation,
    utcOffsetSeconds: raw.utc_offset_seconds,
    current,
    hourly,
    daily,
    air: airResult.status === 'fulfilled' ? normalizeAir(airResult.value) : null,
    fetchedAt: new Date().toISOString(),
  }
}
