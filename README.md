# Skyline

A weather dashboard built with Next.js 16 and deployed on Vercel. Search any city on earth for current conditions, a 24-hour temperature and precipitation chart, a 7-day outlook, air quality, and sunrise/sunset details.

**Live app:** [weathertest-vert.vercel.app](https://weathertest-vert.vercel.app)

## Features

- **Any city** — global search powered by Open-Meteo geocoding, with keyboard navigation and `/` as a shortcut.
- **Live conditions** — temperature, feels-like, humidity, wind and gusts, pressure, visibility, UV, dew point, and cloud cover.
- **24-hour chart** — a hand-built SVG chart with temperature curve and precipitation probability bars. Hover for hour-by-hour detail.
- **7-day outlook** — daily highs and lows with a range bar scaled to the week.
- **Air quality & daylight** — US AQI with pollutants, plus a sunrise/sunset arc that tracks the current position of the sun.
- **Weather-aware design** — the accent and atmosphere shift with conditions and time of day.
- **Location aware** — use the locate button for the forecast where you are. The URL stays shareable.
- **No API keys** — Open-Meteo is free for non-commercial use and needs no configuration.

## Stack

- [Next.js 16](https://nextjs.org) with the App Router and Cache Components
- React 19
- Tailwind CSS 4
- [Open-Meteo](https://open-meteo.com) forecast, air-quality, and geocoding APIs
- TypeScript

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run start
```

No environment variables are required.

## Deploy to Vercel

The repository is Vercel-ready. Either import it at [vercel.com/new](https://vercel.com/new), or use the CLI:

```bash
npx vercel
npx vercel --prod
```

Vercel detects Next.js automatically. There is nothing else to configure.

## How it works

- `src/app/page.tsx` reads `lat` / `lon` (plus display names) from the URL and streams the dashboard inside a Suspense boundary. The static shell is a matching skeleton.
- `src/lib/weather-server.ts` fetches forecast and air-quality data together and caches the normalized result with `use cache` and `cacheLife('minutes')`.
- `src/app/api/weather/route.ts` serves client-side city changes from the same cached data layer.
- `src/app/api/geocode/route.ts` proxies place search and caches it for a day.
- `src/components/weather/*` contains the UI: search, hero, hourly chart, daily rows, and cards. All charts are custom SVG — no charting dependency.

## Data

Weather data by [Open-Meteo](https://open-meteo.com). Please keep the attribution if you reuse this project.
