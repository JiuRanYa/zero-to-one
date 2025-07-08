import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitch } from '@/components/language-switch'
import { MobileMenu } from '@/components/mobile-menu'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center">
            {siteConfig.mainNav?.length ? (
              <div className="flex items-center border-r border-gray-200 dark:border-gray-800 pr-4 mr-4">
                {siteConfig.mainNav?.map(
                  (item, index) =>
                    item.href && (
                      <Link
                        key={index}
                        href={item.href}
                        className={cn(
                          'flex items-center text-sm font-medium text-muted-foreground px-4',
                          item.disabled && 'cursor-not-allowed opacity-80'
                        )}
                      >
                        {item.title}
                      </Link>
                    )
                )}
              </div>
            ) : null}
            <div className="flex items-center space-x-1">
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
            </div>
          </nav>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
