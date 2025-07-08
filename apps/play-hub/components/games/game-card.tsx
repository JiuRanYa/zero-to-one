'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Game } from '@/config/games'
import { useTranslations } from 'next-intl'

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const t = useTranslations(`${game.id}.metadata`)
  const gamesT = useTranslations()

  return (
    <Link
      href={game.link}
      title={t('title')}
      className="group relative overflow-hidden rounded-lg border bg-background p-1.5 transition-colors hover:bg-accent sm:p-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-md sm:aspect-video">
        <Image
          src={game.image}
          alt={gamesT(`${game.id}.title`)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-2 sm:p-4">
        <h2 
          className="text-base font-semibold sm:text-lg"
          title={t('keywords')}
        >
          {gamesT(`${game.id}.title`)}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
          {gamesT(`${game.id}.description`)}
        </p>
      </div>
    </Link>
  )
} 