'use client'

import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { I18nProvider } from '@/contexts/I18nProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[hsl(var(--background))] font-cairo antialiased">
        <I18nProvider>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
