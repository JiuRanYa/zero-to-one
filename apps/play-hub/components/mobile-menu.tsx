'use client'

import { siteConfig } from '@/config/site'
import { Icons } from '@/components/icons'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitch } from '@/components/language-switch'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MenuIcon } from 'lucide-react'

export function MobileMenu() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'md:hidden'
          )}
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">打开菜单</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>菜单</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <nav className="flex flex-col gap-4">
            {siteConfig.mainNav?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium text-muted-foreground hover:text-primary',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </nav>
          <div className="flex flex-col gap-4 border-t pt-4">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <Icons.gitHub className="h-5 w-5" />
              GitHub
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <Icons.twitter className="h-5 w-5" />
              Twitter
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSwitch />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 