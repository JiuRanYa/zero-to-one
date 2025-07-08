'use client'
import { cn } from '@/lib/utils'

interface GameCellProps {
  value: number | null
  previewValue: number | null
  isInitial: boolean
  isSelected: boolean
  isError: boolean
  isHint: boolean
  onClick: () => void
  position: [number, number]
  isFirstRow: boolean
  isLastRow: boolean
  isFirstCol: boolean
  isLastCol: boolean
}

export function GameCell({
  value,
  previewValue,
  isInitial,
  isSelected,
  isError,
  isHint,
  onClick,
  position,
  isFirstRow,
  isLastRow,
  isFirstCol,
  isLastCol,
}: GameCellProps) {
  const [row, col] = position
  const isThickBottom = (row + 1) % 3 === 0 && !isLastRow
  const isThickRight = (col + 1) % 3 === 0 && !isLastCol

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'aspect-square text-xl md:text-2xl',
        'bg-[#f5e6d3] cursor-pointer select-none',
        'border-[0.5px] border-gray-400',
        'active:bg-orange-200 transition-colors duration-150',
        // 3x3区域边框
        isThickRight && 'border-r-2 border-r-gray-700',
        isThickBottom && 'border-b-2 border-b-gray-700',
        // 外边框
        isFirstRow && 'border-t-2 border-t-gray-700',
        isLastRow && 'border-b-2 border-b-gray-700',
        isFirstCol && 'border-l-2 border-l-gray-700',
        isLastCol && 'border-r-2 border-r-gray-700',
        // 圆角
        isFirstRow && isFirstCol && 'rounded-tl-lg',
        isFirstRow && isLastCol && 'rounded-tr-lg',
        isLastRow && isFirstCol && 'rounded-bl-lg',
        isLastRow && isLastCol && 'rounded-br-lg',
        // 触摸反馈
        'touch-none'
      )}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute inset-0 border-2 border-orange-400 pointer-events-none" />
      )}
      {previewValue ? (
        <span className={cn(
          'font-medium',
          isInitial ? 'text-gray-900' : 'text-blue-400 opacity-50'
        )}>
          {previewValue}
        </span>
      ) : (
        <span className={cn(
          'font-medium transition-transform duration-150',
          isError && 'text-red-500',
          isInitial && 'text-gray-900',
          !isInitial && !isError && 'text-blue-600',
          isHint && 'animate-[scale_2s_ease-in-out]',
          isSelected && 'scale-110'
        )}>
          {value}
        </span>
      )}
    </div>
  )
} 