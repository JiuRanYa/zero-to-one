import '@/styles/globals.css'
import { Metadata } from 'next'

import { siteConfig } from '@/config/site'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { routing } from '@/core/i18n/routing'
import { notFound } from 'next/navigation'
import {NextIntlClientProvider, hasLocale} from 'next-intl'

interface RootLayoutProps {
    children: React.ReactNode;
    params: Promise<{locale: string}>;
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://games.tool.tokyo'

  // 为每个语言生成备用链接
  const alternates: Record<string, string> = {}
  routing.locales.forEach((lang) => {
    alternates[lang] = `${baseUrl}/${lang}`
  })

  return {
    title: {
      default: siteConfig.name,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    alternates: {
      languages: alternates,
      canonical: `${baseUrl}/${locale}`
    },
    verification: {
      google: 'yVxpP1GBNYvJP0t8G7YlfMhiUXWOV1FTwgbtQeGKr08'
    }
  }
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  return (
    <>
      <html lang={locale} suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <NextIntlClientProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
              </div>
            </ThemeProvider>
          </NextIntlClientProvider>
          <TailwindIndicator />
        </body>
      </html>
    </>
  )
}
