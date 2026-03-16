import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Space_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" });
const _spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: 'Sortify - Organize Your Spotify Library',
  description: 'Effortlessly sort your liked songs into mood-based playlists with AI-powered suggestions.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f8f7f4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${_instrumentSerif.variable} ${_spaceMono.variable} font-sans antialiased`}>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
