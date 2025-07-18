import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { buttonVariants } from '@zto/ui/components/button'
import { Icons } from '@zto/ui/components/icons'
import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitch } from '@/components/language-switch'

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
            <LanguageSwitch />
          </nav>
        </div>
      </div>
    </header>
  )
}
