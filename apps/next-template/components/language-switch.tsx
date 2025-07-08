'use client'

import { usePathname, useRouter } from '@/core/i18n/navigation'
import { Icons } from '@zto/ui/components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@zto/ui/components/dropdown-menu'
import { buttonVariants } from '@zto/ui/components/button'

export function LanguageSwitch() {
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={buttonVariants({
            size: 'icon',
            variant: 'ghost',
          })}
        >
          <Icons.languages className="h-4 w-4" />
          <span className="sr-only">Language</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleLanguage('zh')}>
          中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}