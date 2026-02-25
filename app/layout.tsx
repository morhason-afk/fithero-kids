import type { Metadata } from 'next'
import './design-system.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitHero Kids - Exercise Game',
  description: 'Move • Play • Grow! A fun gamified exercise app for kids',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧒</text></svg>",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#1A1A2E',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FitHero Kids',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark-theme">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <div id="__app" className="app-root">
          {children}
        </div>
      </body>
    </html>
  )
}
