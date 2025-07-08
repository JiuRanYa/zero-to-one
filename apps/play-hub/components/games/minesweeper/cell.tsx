import { cn } from '@/lib/utils'
import { CellState } from './types'

interface CellProps {
  state: CellState
  onClick: () => void
  onRightClick: () => void
}

export function Cell({ state, onClick, onRightClick }: CellProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    onRightClick()
  }

  const getCellContent = () => {
    if (state.isFlagged) {
      return '🚩'
    }
    if (!state.isRevealed) {
      return ''
    }
    if (state.isMine) {
      return '💣'
    }
    return state.neighborMines > 0 ? state.neighborMines : ''
  }

  const getNumberColor = () => {
    const colors = [
      'text-blue-500',   // 1
      'text-green-500',  // 2
      'text-red-500',    // 3
      'text-purple-500', // 4
      'text-yellow-500', // 5
      'text-pink-500',   // 6
      'text-orange-500', // 7
      'text-gray-500',   // 8
    ]
    return state.neighborMines > 0 ? colors[state.neighborMines - 1] : ''
  }

  return (
    <button
      className={cn(
        'flex h-8 w-8 items-center justify-center text-sm font-bold transition-all duration-100',
        'border-t-[3px] border-l-[3px] border-r-[3px] border-b-[3px]',
        state.isRevealed
          ? 'bg-gray-100 border-gray-300 border-t-gray-300 border-l-gray-300'
          : cn(
            'bg-gray-300 hover:bg-gray-400/80',
            'border-t-gray-100 border-l-gray-100',
            'border-r-gray-600 border-b-gray-600'
          ),
        getNumberColor()
      )}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      {getCellContent()}
    </button>
  )
} 