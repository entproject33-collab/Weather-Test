'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { countryFlag, type GeocodeResult, type Place } from '@/lib/weather'
import { CloseIcon, PinIcon, SearchIcon } from './ui'

type SearchBoxProps = {
  onSelect: (place: Place) => void
  className?: string
}

function resultToPlace(result: GeocodeResult): Place {
  return {
    name: result.name,
    region: result.admin1,
    country: result.country,
    countryCode: result.countryCode,
    latitude: result.latitude,
    longitude: result.longitude,
  }
}

export function SearchBox({ onSelect, className = '' }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [active, setActive] = useState(-1)

  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!response.ok) throw new Error('Geocoding request failed')

        const data = (await response.json()) as { results: GeocodeResult[] }
        if (controller.signal.aborted) return

        setResults(data.results)
        setMessage(
          data.results.length === 0 ? `No places found for “${trimmed}”. Try another spelling.` : null,
        )
        if (document.activeElement === inputRef.current) setOpen(true)
      } catch {
        if (controller.signal.aborted) return
        setResults([])
        setMessage('Search is unavailable right now. Please try again.')
        setOpen(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 240)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function handleShortcut(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return
      }
      event.preventDefault()
      inputRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleShortcut)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleShortcut)
    }
  }, [])

  function selectResult(result: GeocodeResult) {
    setQuery(result.name)
    setResults([])
    setMessage(null)
    setOpen(false)
    setActive(-1)
    inputRef.current?.blur()
    onSelect(resultToPlace(result))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (active >= 0 && results[active]) {
      selectResult(results[active])
      return
    }

    if (results.length > 0) {
      selectResult(results[0])
      return
    }

    const trimmed = query.trim()
    if (trimmed.length < 2) return

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`, {
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('Geocoding request failed')
      const data = (await response.json()) as { results: GeocodeResult[] }

      if (data.results[0]) {
        selectResult(data.results[0])
      } else {
        setMessage(`No places found for “${trimmed}”. Try another spelling.`)
        setOpen(true)
      }
    } catch {
      setMessage('Search is unavailable right now. Please try again.')
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value
    setQuery(nextQuery)
    setActive(-1)
    setMessage(null)

    if (nextQuery.trim().length < 2) {
      setResults([])
      setLoading(false)
      setOpen(false)
    } else {
      setLoading(true)
      setOpen(true)
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open && (results.length > 0 || message)) {
        setOpen(true)
        return
      }
      if (results.length > 0) {
        setActive((current) => (current + 1) % results.length)
      }
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (results.length > 0) {
        setActive((current) => (current <= 0 ? results.length - 1 : current - 1))
      }
    }
  }

  const showPanel = open && (results.length > 0 || message !== null)

  return (
    <form role="search" onSubmit={handleSubmit} className={`relative ${className}`}>
      <div ref={rootRef} className="relative">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/35" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            if (results.length > 0 || message) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-label="Search for a city"
          aria-expanded={showPanel}
          aria-haspopup="listbox"
          aria-controls={showPanel ? 'geocode-results' : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            active >= 0 && results[active] ? `geocode-option-${results[active].id}` : undefined
          }
          aria-busy={loading}
          placeholder="Search city…"
          autoComplete="off"
          spellCheck={false}
          className="h-11 w-full rounded-full border border-white/10 bg-white/[0.04] pl-10 pr-16 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-white/30 transition-colors hover:border-white/15 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          {loading ? (
            <span
              className="mr-1.5 size-3.5 animate-spin rounded-full border border-white/20 border-t-white/80"
              aria-hidden="true"
            />
          ) : null}
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setResults([])
                setMessage(null)
                setOpen(false)
                inputRef.current?.focus()
              }}
              className="grid size-7 place-items-center rounded-full text-white/35 transition-colors hover:bg-white/[0.07] hover:text-white/70"
              aria-label="Clear search"
            >
              <CloseIcon className="size-3.5" />
            </button>
          ) : (
            <kbd className="mr-1 hidden rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-sans text-[10px] text-white/30 sm:block">
              /
            </kbd>
          )}
        </div>

        {showPanel ? (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0b111c]/95 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
            {results.length > 0 ? (
              <ul
                id="geocode-results"
                role="listbox"
                aria-label="Search results"
                className="max-h-80 overflow-y-auto"
              >
                {results.map((result, index) => {
                  const flag = countryFlag(result.countryCode)
                  const detail = [result.admin1, result.country].filter(Boolean).join(', ')
                  const isActive = active === index

                  return (
                    <li
                      key={`${result.id}-${result.latitude}-${result.longitude}`}
                      id={`geocode-option-${result.id}`}
                      role="option"
                      aria-selected={isActive}
                      onPointerEnter={() => setActive(index)}
                      onClick={() => selectResult(result)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${
                        isActive ? 'bg-white/[0.07]' : 'hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/[0.07] bg-white/[0.035] text-sm">
                        {flag ?? <PinIcon className="size-3.5 text-white/40" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-white/90">
                          {result.name}
                        </span>
                        <span className="block truncate text-[11px] text-white/40">
                          {detail || 'Selected location'}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p
                id="geocode-results"
                role="status"
                className="px-3 py-4 text-xs leading-relaxed text-white/45"
              >
                {message}
              </p>
            )}
            <div className="mt-1 flex items-center justify-between border-t border-white/[0.06] px-3 pb-1 pt-2.5">
              <span className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                Search by Open-Meteo
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                ↑ ↓ to browse
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  )
}
