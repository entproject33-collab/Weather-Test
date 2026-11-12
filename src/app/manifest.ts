import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Skyline — Live weather dashboard',
    short_name: 'Skyline',
    description:
      'Current conditions, a 24-hour outlook, 7-day forecast, air quality and daylight for any city in the world.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070a12',
    theme_color: '#070a12',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
