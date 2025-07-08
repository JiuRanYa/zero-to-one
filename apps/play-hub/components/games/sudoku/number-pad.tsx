import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NumberPadProps {
  onNumberClick: (number: number) => void
  onDelete: () => void
  onHint: () => void
  className?: string
}

export function NumberPad({
  onNumberClick,
  onDelete,
  onHint,
  className
}: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className={cn('w-full max-w-md mx-auto mt-4 px-4', className)}>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {numbers.map((number) => (
          <Button
            key={number}
            variant="outline"
            className="h-12 text-xl font-medium bg-orange-50 hover:bg-orange-100"
            onClick={() => onNumberClick(number)}
          >
            {number}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="h-12 text-lg font-medium bg-red-50 hover:bg-red-100"
          onClick={onDelete}
        >
          删除
        </Button>
        <Button
          variant="outline"
          className="h-12 text-lg font-medium bg-blue-50 hover:bg-blue-100"
          onClick={onHint}
        >
          提示
        </Button>
      </div>
    </div>
  )
} 