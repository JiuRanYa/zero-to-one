import * as React from 'react'
import Link from 'next/link'

import { useTranslations } from 'next-intl'
import Image from 'next/image'

export function MainNav() {
  const t = useTranslations('config')
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/android-chrome-512x512.png" alt="logo" width={32} height={32} className="rounded-full" />
      <span className="inline-block font-bold">{t('name')}</span>
    </Link>
  )
}
