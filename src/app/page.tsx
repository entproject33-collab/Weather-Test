import { Suspense } from 'react'
import { DashboardSkeleton } from '@/components/weather/dashboard-skeleton'
import { WeatherApp } from '@/components/weather/weather-app'
import { parsePlaceFromSearchParams } from '@/lib/place'
import { getWeatherBundle, normalizeCoordinates } from '@/lib/weather-server'

export default function Home({ searchParams }: PageProps<'/'>) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <WeatherPage searchParams={searchParams} />
    </Suspense>
  )
}

async function WeatherPage({
  searchParams,
}: {
  searchParams: PageProps<'/'>['searchParams']
}) {
  const params = await searchParams
  const place = parsePlaceFromSearchParams(params)
  const coordinates = normalizeCoordinates(place.latitude, place.longitude)
  const weather = await getWeatherBundle(coordinates.latitude, coordinates.longitude)

  return <WeatherApp initialPlace={place} initialWeather={weather} />
}
