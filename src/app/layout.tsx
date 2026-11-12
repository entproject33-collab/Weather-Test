import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Instrument_Serif } from 'next/font/google'
import './globals.css'

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Skyline — Live weather dashboard',
  description:
    'A beautifully simple weather dashboard. Current conditions, a 24-hour outlook, 7-day forecast, air quality and daylight for any city in the world.',
  applicationName: 'Skyline',
  keywords: ['weather', 'forecast', 'weather dashboard', 'hourly forecast', 'air quality'],
  authors: [{ name: 'Skyline' }],
  openGraph: {
    title: 'Skyline — Live weather dashboard',
    description:
      'Current conditions, a 24-hour outlook, 7-day forecast, air quality and daylight for any city in the world.',
    siteName: 'Skyline',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skyline — Live weather dashboard',
    description:
      'Current conditions, a 24-hour outlook, 7-day forecast, air quality and daylight for any city in the world.',
  },
}

export const viewport: Viewport = {
  themeColor: '#070a12',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  )
}
