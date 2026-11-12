import { DEFAULT_PLACE, type Place } from './weather'

type SearchParams = Record<string, string | string[] | undefined>

function readString(value: string | string[] | undefined, maxLength = 80): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return undefined
  const clean = raw.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  if (!clean) return undefined
  return clean.slice(0, maxLength)
}

function readCoordinate(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export function parsePlaceFromSearchParams(params: SearchParams): Place {
  const latitude = readCoordinate(params.lat)
  const longitude = readCoordinate(params.lon)

  if (
    latitude === null ||
    longitude === null ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return DEFAULT_PLACE
  }

  const countryCode = readString(params.cc, 2)?.toUpperCase()
  const validCountryCode = countryCode && /^[A-Z]{2}$/.test(countryCode) ? countryCode : undefined

  return {
    name: readString(params.name) ?? 'Selected location',
    region: readString(params.region),
    country: readString(params.country),
    countryCode: validCountryCode,
    latitude,
    longitude,
  }
}

export function placeToQueryString(place: Place): string {
  const params = new URLSearchParams()
  params.set('lat', place.latitude.toFixed(4))
  params.set('lon', place.longitude.toFixed(4))
  if (place.name) params.set('name', place.name)
  if (place.region) params.set('region', place.region)
  if (place.country) params.set('country', place.country)
  if (place.countryCode) params.set('cc', place.countryCode)
  return params.toString()
}
