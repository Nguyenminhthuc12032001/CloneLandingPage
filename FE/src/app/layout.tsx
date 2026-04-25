import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { FloatingDock } from '@/components/store/FloatingDock'
import { StoreProvider } from '@/components/store/StoreProvider'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Renewed Mobile Store | Điện thoại cũ đẹp, giá tốt',
    template: '%s | Renewed Mobile Store',
  },
  description:
    'Điện thoại đã qua sử dụng được kiểm tra kỹ, hiển thị rõ pin, giá bán, thu cũ và bảo hành 12 tháng.',
  applicationName: 'Renewed Mobile Store',
  keywords: [
    'điện thoại cũ',
    'renewed phone',
    'thu cũ đổi mới',
    'iPhone cũ',
    'Samsung cũ',
    'Google Pixel cũ',
  ],
  category: 'technology',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Renewed Mobile Store | Điện thoại cũ đẹp, giá tốt',
    description:
      'Danh mục iPhone, Samsung và Pixel đã qua sử dụng với giá tốt, pin rõ ràng và hỗ trợ thu cũ đổi mới.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Renewed Mobile Store | Điện thoại cũ đẹp, giá tốt',
    description:
      'Khám phá danh mục điện thoại đã qua sử dụng với pin rõ ràng, giá tốt và hỗ trợ thu cũ đổi mới.',
  },
}

export const viewport: Viewport = {
  themeColor: '#f5f5f7',
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <StoreProvider>
          <div className="app-frame">
            <a href="#main-content" className="skip-link">
              Bỏ qua điều hướng
            </a>
            <SiteHeader />
            <main id="main-content">{children}</main>
            <SiteFooter />
            <FloatingDock />
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
