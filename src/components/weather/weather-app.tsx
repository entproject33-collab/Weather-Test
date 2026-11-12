'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import Link from 'next/link'
import { formatRelativeTime, type Unit } from '@/lib/format'
import { placeToQueryString } from '@/lib/place'
import {
  getCondition,
  getTheme,
  placeLabel,
  type Place,
  type WeatherResponse,
  type WeatherSnapshot,
} from '@/lib/weather'
import { AirQualityCard } from './air-quality-card'
import { Atmosphere } from './atmosphere'
import { CurrentDetails } from './current-details'
import { DailyForecast } from './daily-forecast'
import { Hero } from './hero'
import { HourlyChart } from './hourly-chart'
import { SearchBox } from './search-box'
import { SunCard } from './sun-card'
import { AlertIcon, CloseIcon, LocateIcon, Logo, UnitToggle } from './ui'

type WeatherAppProps = {
  initialPlace: Place
  initialWeather: WeatherSnapshot
}

const UNIT_STORAGE_KEY = 'skyline:unit'
const UNIT_EVENT = 'skyline:unit-change'

function subscribeToUnit(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(UNIT_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(UNIT_EVENT, callback)
  }
}

function getStoredUnit(): Unit | null {
  const stored = window.localStorage.getItem(UNIT_STORAGE_KEY)
  return stored === 'c' || stored === 'f' ? stored : null
}

function getServerUnit(): Unit | null {
  return null
}

export function WeatherApp({ initialPlace, initialWeather }: WeatherAppProps) {
  const [place, setPlace] = useState(initialPlace)
  const [weather, setWeather] = useState(initialWeather)
  const [defaultUnit, setDefaultUnit] = useState<Unit>(
    initialPlace.countryCode === 'US' ? 'f' : 'c',
  )
  const storedUnit = useSyncExternalStore(subscribeToUnit, getStoredUnit, getServerUnit)
  const unit: Unit = storedUnit ?? defaultUnit
  const [refreshing, setRefreshing] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState(initialWeather.fetchedAt)
  const [now, setNow] = useState<number | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const requestRef = useRef(0)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const initialTick = window.setTimeout(tick, 0)
    const timer = window.setInterval(tick, 60_000)
    return () => {
      window.clearTimeout(initialTick)
      window.clearInterval(timer)
    }
  }, [])

  function changeUnit(nextUnit: Unit) {
    setDefaultUnit(nextUnit)
    try {
      window.localStorage.setItem(UNIT_STORAGE_KEY, nextUnit)
      window.dispatchEvent(new Event(UNIT_EVENT))
    } catch {
      // Storage can fail in private browsing; the in-memory preference still works.
    }
  }

  const loadPlace = useCallback(async (nextPlace: Place, options?: { quiet?: boolean }) => {
    const quiet = options?.quiet ?? false

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const requestId = requestRef.current + 1
    requestRef.current = requestId

    if (!quiet) setRefreshing(true)
    setError(null)

    try {
      const response = await fetch(`/api/weather?${placeToQueryString(nextPlace)}`, {
        signal: controller.signal,
        cache: 'no-store',
      })

      if (!response.ok) throw new Error(`Weather request failed (${response.status})`)

      const data = (await response.json()) as WeatherResponse
      if (requestRef.current !== requestId) return

      setWeather(data.weather)
      setPlace(data.place)
      setUpdatedAt(data.weather.fetchedAt)

      const url = `${window.location.pathname}?${placeToQueryString(data.place)}`
      window.history.replaceState(null, '', url)
    } catch {
      if (controller.signal.aborted || requestRef.current !== requestId) return
      if (!quiet) {
        setError(
          'We couldn’t load the weather for that location. Check your connection and try again.',
        )
      }
    } finally {
      if (requestRef.current === requestId) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      void loadPlace(place, { quiet: true })
    }, 10 * 60_000)

    return () => window.clearInterval(timer)
  }, [place, loadPlace])

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState !== 'visible') return
      const age = Date.now() - new Date(updatedAt).getTime()
      if (age > 10 * 60_000) void loadPlace(place, { quiet: true })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [place, updatedAt, loadPlace])

  function handleLocate() {
    if (locating) return

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser. Try searching for a city instead.')
      return
    }

    setError(null)
    setLocating(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        void loadPlace({
          name: 'Current location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (geoError) => {
        setLocating(false)
        setError(
          geoError.code === 1
            ? 'Location access is blocked. You can still search for a city above.'
            : 'We couldn’t determine your location. Try searching for a city instead.',
        )
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    )
  }

  const theme = getTheme(weather.current.weatherCode, weather.current.isDay)
  const condition = getCondition(weather.current.weatherCode)
  const themeStyle = {
    '--accent': theme.accent,
    '--accent-2': theme.accentSoft,
    '--glow-1': theme.glowOne,
    '--glow-2': theme.glowTwo,
  } as CSSProperties

  const updatedLabel = now === null ? 'just now' : formatRelativeTime(updatedAt, now)
  const today = weather.daily[0]
  const coords = `${Math.abs(place.latitude).toFixed(2)}° ${
    place.latitude >= 0 ? 'N' : 'S'
  } · ${Math.abs(place.longitude).toFixed(2)}° ${place.longitude >= 0 ? 'E' : 'W'}`

  return (
    <div className="skyline-app" style={themeStyle} data-theme={theme.key}>
      <Atmosphere stars={theme.stars} />

      {refreshing ? (
        <div
          role="progressbar"
          aria-label="Updating weather"
          className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-white/5"
        >
          <div
            className="h-full w-1/3 rounded-full bg-[var(--accent)]"
            style={{ animation: 'progress-slide 1.2s ease-in-out infinite' }}
          />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1240px] flex-col px-4 pb-8 sm:px-6 lg:px-8">
        <a href="#weather-main" className="skip-link">
          Skip to weather
        </a>

        <header className="flex flex-wrap items-center gap-3 py-5 sm:py-6">
          <Link href="/" className="mr-auto rounded-full">
            <Logo />
          </Link>

          <div className="order-2 flex w-full items-center gap-2 md:order-1 md:w-auto">
            <SearchBox
              className="min-w-0 flex-1 md:w-72"
              onSelect={(nextPlace) => {
                void loadPlace(nextPlace)
              }}
            />
            <button
              type="button"
              onClick={handleLocate}
              disabled={locating}
              aria-label="Use my current location"
              title="Use my current location"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-colors hover:border-white/20 hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              {locating ? (
                <span
                  className="size-4 animate-spin rounded-full border border-white/20 border-t-white/80"
                  aria-hidden="true"
                />
              ) : (
                <LocateIcon className="size-[18px]" />
              )}
            </button>
          </div>

          <div className="order-1 md:order-2">
            <UnitToggle unit={unit} onChange={changeUnit} />
          </div>
        </header>

        {error ? (
          <div
            role="alert"
            className="mb-3 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-4 py-3 text-[12px] leading-relaxed text-red-50/80"
          >
            <AlertIcon className="mt-0.5 size-4 shrink-0 text-red-300/80" />
            <p className="flex-1">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              aria-label="Dismiss message"
              className="mt-0.5 grid size-6 place-items-center rounded-full text-red-100/50 transition-colors hover:bg-white/[0.06] hover:text-red-50"
            >
              <CloseIcon className="size-3.5" />
            </button>
          </div>
        ) : null}

        <main
          id="weather-main"
          key={`${place.latitude.toFixed(3)}:${place.longitude.toFixed(3)}`}
          aria-busy={refreshing}
          className="mt-2 mb-7 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5"
        >
          {today ? (
            <Hero
              place={place}
              current={weather.current}
              today={today}
              hourly={weather.hourly}
              unit={unit}
              updatedLabel={updatedLabel}
              refreshing={refreshing}
              onRefresh={() => {
                void loadPlace(place)
              }}
            />
          ) : null}

          <CurrentDetails current={weather.current} today={today} unit={unit} />
          <HourlyChart hours={weather.hourly} unit={unit} />
          <DailyForecast days={weather.daily} unit={unit} />
          <div className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            {today ? <SunCard current={weather.current} today={today} /> : null}
            <AirQualityCard air={weather.air} />
          </div>
        </main>

        <footer className="mt-auto flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4 text-[10px] text-white/25">
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span>Data by</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 underline-offset-2 transition-colors hover:text-white/70 hover:underline"
            >
              Open-Meteo
            </a>
            <span className="text-white/15">·</span>
            <span>Built with Next.js</span>
            <span className="text-white/15">·</span>
            <span>Deployed on Vercel</span>
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-white/35">{placeLabel(place)}</span>
            <span className="text-white/15">·</span>
            <span>{coords}</span>
            <span className="text-white/15">·</span>
            <span>{condition.short}</span>
          </p>
        </footer>
      </div>
    </div>
  )
}
