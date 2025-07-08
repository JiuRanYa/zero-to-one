'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Difficulty } from './game-utils'

interface DifficultySettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStart: (difficulty: Difficulty) => void
}

export function DifficultySettingsModal({
  open,
  onOpenChange,
  onStart,
}: DifficultySettingsModalProps) {
  const difficulties: { label: string; value: Difficulty }[] = [
    { label: '简单', value: 'easy' },
    { label: '中等', value: 'medium' },
    { label: '困难', value: 'hard' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>选择难度</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {difficulties.map(({ label, value }) => (
            <Button
              key={value}
              variant="outline"
              className="w-full"
              onClick={() => {
                onStart(value)
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 