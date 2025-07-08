'use client'

import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DIFFICULTIES, Difficulty, GameStatus } from './types'

interface GameControlsProps {
  difficulty: Difficulty
  gameStatus: GameStatus
  score: number
  onDifficultyChange: (difficulty: Difficulty) => void
  onStart: () => void
  onReset: () => void
}

export function GameControls({
  difficulty,
  gameStatus,
  score,
  onDifficultyChange,
  onStart,
  onReset,
}: GameControlsProps) {
  const t = useTranslations('snake')

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <Select
          value={difficulty.name}
          onValueChange={(value) => onDifficultyChange(DIFFICULTIES[value])}
          disabled={gameStatus === 'playing'}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('controls.selectDifficulty')} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(DIFFICULTIES).map((diff) => (
              <SelectItem key={diff.name} value={diff.name}>
                {diff.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {gameStatus === 'idle' ? (
          <Button onClick={onStart}>{t('controls.start')}</Button>
        ) : (
          <Button onClick={onReset} variant="secondary">
            {t('controls.reset')}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">
          {t('controls.score')}: {score}
        </div>
      </div>
    </div>
  )
} 