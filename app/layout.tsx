import './globals.scss'
import 'locomotive-scroll/locomotive-scroll.css'
import type { Metadata } from 'next'
import { inter, patrick_hand, dosis, cabinSketch } from './fonts'

import { AlertContextProvider } from '@/contexts/AlertContext'
import { LoadingScreenProvider } from '@/contexts/LoadingContext'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import LocomotiveScrollWrapper from '@/components/animation/LocomotiveScrollWrapper'
import { LocomotiveScrollPositionProvider } from '@/contexts/LocomotiveScrollPositionContext'
import { LocomotiveScrollProvider } from '@/contexts/LocomotiveScrollContext'
import { PageExitContextProvider } from '@/contexts/PageExitContext'

export const metadata: Metadata = {
  title: "Jacky FAN - Frontend Developer",
  description: 'Hello I am Jacky FAN, a front end developer in Hong Kong who focus on building high-quality websites.',
  openGraph: {
    title: 'Jacky FAN - Frontend Developer',
    description: 'Hello I am Jacky FAN, a front end developer in Hong Kong who focus on building high-quality websites.',
    siteName: 'Jacky FAN',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'http://rpi5-1:3011/api/media/file/jackyfan-og-v3.png',
        width: 1200,
        height: 630,
        alt: 'Jacky FAN - Frontend Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jacky FAN - Frontend Developer',
    description: 'Hello I am Jacky FAN, a front end developer in Hong Kong who focus on building high-quality websites.',
    images: ['http://rpi5-1:3011/api/media/file/jackyfan-og-v3.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${patrick_hand.variable} ${dosis.variable} ${cabinSketch.variable} overflow-x-hidden`}>
        <AlertContextProvider>
          <LoadingScreenProvider>
            <PageExitContextProvider>
              <LocomotiveScrollPositionProvider>
                <LocomotiveScrollProvider>
                  <LocomotiveScrollWrapper>
                    {children}
                  </LocomotiveScrollWrapper>
                </LocomotiveScrollProvider>
              </LocomotiveScrollPositionProvider>
            </PageExitContextProvider>
          </LoadingScreenProvider>
        </AlertContextProvider>
      </body>
      <GoogleAnalytics />
    </html>
  )
}
