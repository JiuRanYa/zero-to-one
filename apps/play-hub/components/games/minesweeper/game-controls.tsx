import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DIFFICULTIES, Difficulty, GameStatus } from './types'

interface GameControlsProps {
  difficulty: Difficulty
  gameStatus: GameStatus
  remainingMines: number
  timeElapsed: number
  onDifficultyChange: (difficulty: Difficulty) => void
  onReset: () => void
}

export function GameControls({
  difficulty,
  gameStatus,
  remainingMines,
  timeElapsed,
  onDifficultyChange,
  onReset,
}: GameControlsProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getStatusEmoji = () => {
    switch (gameStatus) {
      case 'won':
        return '😎'
      case 'lost':
        return '😵'
      case 'playing':
        return '🙂'
      default:
        return '😊'
    }
  }

  return (
    <div className="mb-6 flex flex-col items-center gap-4 w-full">
      <div className="flex items-center justify-between w-full max-w-[500px] px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">难度：</span>
          <Select
            value={difficulty.name}
            onValueChange={(value) => onDifficultyChange(DIFFICULTIES[value])}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DIFFICULTIES).map((diff) => (
                <SelectItem key={diff.name} value={diff.name}>
                  {diff.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onReset} variant="outline" size="icon" className="w-12 h-12 text-2xl">
          {getStatusEmoji()}
        </Button>
      </div>
      <div className="flex justify-center gap-12 w-full max-w-[500px] px-4">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
          <span className="text-sm font-medium">💣</span>
          <span className="font-mono font-bold text-lg">{remainingMines}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
          <span className="text-sm font-medium">⏱️</span>
          <span className="font-mono font-bold text-lg">{formatTime(timeElapsed)}</span>
        </div>
      </div>
    </div>
  )
} 