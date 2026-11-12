import { normalizeCoordinates, getWeatherBundle } from '@/lib/weather-server'
import type { Place } from '@/lib/weather'

function readText(value: string | null, maxLength = 80): string | undefined {
  if (!value) return undefined
  const clean = value.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  if (!clean) return undefined
  return clean.slice(0, maxLength)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const latitude = Number(url.searchParams.get('lat'))
  const longitude = Number(url.searchParams.get('lon'))

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return Response.json({ error: 'Invalid coordinates.' }, { status: 400 })
  }

  const countryCode = readText(url.searchParams.get('cc'), 2)?.toUpperCase()
  const place: Place = {
    name: readText(url.searchParams.get('name')) ?? 'Selected location',
    region: readText(url.searchParams.get('region')),
    country: readText(url.searchParams.get('country')),
    countryCode: countryCode && /^[A-Z]{2}$/.test(countryCode) ? countryCode : undefined,
    latitude,
    longitude,
  }

  try {
    const coordinates = normalizeCoordinates(latitude, longitude)
    const weather = await getWeatherBundle(coordinates.latitude, coordinates.longitude)

    return Response.json(
      { place, weather },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    )
  } catch (error) {
    console.error('Weather route failed', error)
    return Response.json(
      { error: 'The weather service is unavailable right now.' },
      { status: 502 },
    )
  }
}
