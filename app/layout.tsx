import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import SessionProvider from '@/components/providers/SessionProvider'
import { CSRFProvider } from '@/components/providers/CSRFProvider'
import { AnalyticsProvider } from '@/lib/analytics'
import { NotificationProvider } from '@/lib/notifications'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Sunday Traveller - A Soldier\'s Journey Through Life and Adventure',
  description: 'Follow Vineet Kumar\'s extraordinary journey from military service to global exploration. Discover 47+ countries through the eyes of a soldier-explorer who finds profound lessons in every adventure.',
  keywords: 'travel, adventure, military, soldier, destinations, travel blog, memoir, Vineet Kumar, extreme sports, cultural exploration',
  authors: [{ name: 'Vineet Kumar' }],
  creator: 'Vineet Kumar',
  publisher: 'The Sunday Traveller',
  openGraph: {
    title: 'The Sunday Traveller - Explore the World',
    description: 'Join me on incredible journeys around the world. Discover hidden gems, cultural insights, and travel tips.',
    url: 'https://thesundaytraveller.com',
    siteName: 'The Sunday Traveller',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'The Sunday Traveller - Travel Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Sunday Traveller - Explore the World',
    description: 'Join me on incredible journeys around the world. Discover hidden gems, cultural insights, and travel tips.',
    images: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get Google Analytics ID from environment variables
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <SessionProvider session={null}>
          <ThemeProvider>
            <CSRFProvider>
              <AnalyticsProvider trackingId={gaId}>
                <NotificationProvider>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      {children}
                    </main>
                    <Footer />
                  </div>
                </NotificationProvider>
              </AnalyticsProvider>
            </CSRFProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
