import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { StoreProvider } from '@/components/store/StoreProvider'

import './globals.css'

export const metadata: Metadata = {
  title: 'Renewed Mobile Store',
  description: 'Apple-inspired ecommerce experience for selling premium used phones with MVC architecture on Next.js.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <div className="app-frame">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
