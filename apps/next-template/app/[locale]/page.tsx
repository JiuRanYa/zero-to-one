import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { buttonVariants } from '@zto/ui/components/button'
import { getTranslations } from 'next-intl/server'

export default async function IndexPage() {
  const t = await getTranslations('Index')

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {t('title')}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          {t('documentation')}
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: 'outline' })}
        >
          {t('github')}
        </Link>
      </div>
    </section>
  )
}
