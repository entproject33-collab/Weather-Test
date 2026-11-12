import { cacheLife } from 'next/cache'
import type { GeocodeResult } from '@/lib/weather'

const GEOCODE_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search'

type RawGeocodeResponse = {
  results?: Array<{
    id: number
    name: string
    latitude: number
    longitude: number
    country?: string
    admin1?: string
    country_code?: string
    timezone?: string
  }>
}

async function searchPlaces(query: string): Promise<GeocodeResult[]> {
  'use cache'
  cacheLife('days')

  const params = new URLSearchParams({
    name: query,
    count: '6',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(`${GEOCODE_ENDPOINT}?${params.toString()}`, {
    headers: { accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Geocoding request failed with ${response.status}`)
  }

  const data = (await response.json()) as RawGeocodeResponse
  return (data.results ?? []).map((result) => ({
    id: result.id,
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
    countryCode: result.country_code,
    timezone: result.timezone,
  }))
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')?.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 64)

  if (!query || query.length < 2) {
    return Response.json({ results: [] })
  }

  try {
    const results = await searchPlaces(query)
    return Response.json(
      { results },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    )
  } catch (error) {
    console.error('Geocode route failed', error)
    return Response.json({ error: 'Search is unavailable right now.' }, { status: 502 })
  }
}
