'use client'
import { useState, useEffect, useCallback } from 'react'
import { GameTile } from './game-tile'
import { cn } from '@/lib/utils'
import {
  initializeGame,
  move,
  generateNumber,
  canMove,
  hasWon,
  createEmptyGrid,
  Tile,
  GameState,
  saveGameState,
  loadGameState,
  clearGameState,
  updateGameConfig,
  GameConfig,
  DEFAULT_GAME_CONFIG
} from './game-utils'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useTranslations } from 'next-intl'
import { DifficultySettingsModal } from './difficulty-settings-modal'

export interface GameBoardProps {
  className?: string
}

interface TouchPosition {
  x: number;
  y: number;
}

export function GameBoard({ className }: GameBoardProps) {
  const t = useTranslations('2048')
  const [grid, setGrid] = useState<(Tile | null)[][]>(createEmptyGrid())
  const [score, setScore] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [won, setWon] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null)
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
  const [currentConfig, setCurrentConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG)

  // 保存游戏状态
  const saveGame = useCallback(() => {
    const gameState: GameState = {
      grid,
      score,
      gameOver,
      won
    }
    saveGameState(gameState)
  }, [grid, score, gameOver, won])

  // 在游戏状态改变时自动保存
  useEffect(() => {
    if (isInitialized) {
      saveGame()
    }
  }, [grid, score, gameOver, won, isInitialized, saveGame])

  // 在组件卸载时保存游戏状态
  useEffect(() => {
    return () => {
      if (isInitialized) {
        saveGame()
      }
    }
  }, [isInitialized, saveGame])

  // 在客户端初始化游戏和配置
  useEffect(() => {
    if (!isInitialized) {
      // 从 localStorage 加载配置
      const savedConfig = localStorage.getItem('2048_config')
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        setCurrentConfig(parsedConfig)
        updateGameConfig(parsedConfig)
      }

      // 检查是否有保存的游戏状态
      const savedState = loadGameState()
      if (savedState) {
        setGrid(savedState.grid)
        setScore(savedState.score)
        setGameOver(savedState.gameOver)
        setWon(savedState.won)
      } else {
        setGrid(initializeGame())
      }
      setIsInitialized(true)
    }
  }, [isInitialized])

  const handleConfigChange = (newConfig: GameConfig) => {
    setCurrentConfig(newConfig)
    updateGameConfig(newConfig)
    // 保存到 localStorage
    localStorage.setItem('2048_config', JSON.stringify(newConfig))
    // 重置游戏
    resetGame()
  }

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || won || !isInitialized) return

    const { grid: newGrid, score: moveScore, moved } = move(grid, direction)
    
    if (moved) {
      const gridWithNewNumber = generateNumber(newGrid)
      setGrid(gridWithNewNumber)
      setScore(prev => prev + moveScore)
      
      // 检查游戏状态
      if (hasWon(gridWithNewNumber)) {
        setWon(true)
      } else if (!canMove(gridWithNewNumber)) {
        setGameOver(true)
      }
    }
  }, [grid, gameOver, won, isInitialized])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      KeyW: 'up',
      KeyS: 'down',
      KeyA: 'left',
      KeyD: 'right',
    }

    const direction = keyMap[event.code]
    if (direction) {
      event.preventDefault()
      handleMove(direction)
    }
  }, [handleMove])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const resetGame = useCallback(() => {
    clearGameState() // 清除保存的游戏状态
    const newGrid = initializeGame()
    setGrid(newGrid)
    setScore(0)
    setGameOver(false)
    setWon(false)
    setIsInitialized(true)
  }, [])

  // 获取所有非空方块
  const tiles = grid.flatMap((row, i) =>
    row.map((tile, j) => tile ? { ...tile, position: { row: i, col: j } } : null)
  ).filter((tile): tile is Tile => tile !== null)

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0]
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    })
  }, [])

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (!touchStart) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const minDistance = 30 // 最小滑动距离，防止误触

    // 重置触摸起始位置
    setTouchStart(null)

    // 判断滑动方向
    if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) {
      return // 滑动距离太小，忽略
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      handleMove(deltaX > 0 ? 'right' : 'left')
    } else {
      // 垂直滑动
      handleMove(deltaY > 0 ? 'down' : 'up')
    }
  }, [touchStart, handleMove])

  const rulesContent = t.raw('accordion.rules.content') as string[]
  const controlsContent = t.raw('accordion.controls.content') as string[]
  const scoringContent = t.raw('accordion.scoring.content') as string[]
  const strategyContent = t.raw('accordion.strategy.content') as string[]

  return (
    <div className="flex flex-col items-center gap-4 w-full min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <div className="w-full max-w-[500px] min-w-[280px] flex items-center justify-between px-2">
        <div className="text-2xl font-bold">{t('score')}: {score}</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSettingsOpen(true)}>
            {t('settings.button')}
          </Button>
          <Button onClick={resetGame}>{t('restart')}</Button>
        </div>
      </div>
      
      <div 
        className={cn(
          'relative w-full max-w-[500px] min-w-[280px] aspect-square',
          'rounded-lg bg-[#bbada0] p-3 md:p-4',
          'touch-none', // 防止触摸时出现浏览器默认行为
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {(gameOver || won) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-50">
            <div className="text-4xl font-bold text-white">
              {won ? t('youWin') : t('gameOver')}
            </div>
          </div>
        )}
        <div className="relative h-full w-full">
          {/* 背景格子 */}
          <div className="flex flex-wrap h-full w-full">
            {Array(currentConfig.GRID_SIZE * currentConfig.GRID_SIZE).fill(null).map((_, i) => (
              <div
                key={i}
                className="relative rounded-md bg-[#cdc1b4]"
                style={{
                  width: `${(100 - 0.8 * 2 * currentConfig.GRID_SIZE) / currentConfig.GRID_SIZE}%`,
                  paddingBottom: `${(100 - 0.8 * 2 * currentConfig.GRID_SIZE) / currentConfig.GRID_SIZE}%`,
                  margin: '0.8%',
                }}
              />
            ))}
          </div>
          {/* 数字方块 */}
          {tiles.map(tile => (
            <GameTile
              key={tile.id}
              tile={tile}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-[500px] min-w-[280px] mt-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="rules">
            <AccordionTrigger>{t('accordion.rules.title')}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                {rulesContent.map((rule: string, index: number) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="controls">
            <AccordionTrigger>{t('accordion.controls.title')}</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">{t('accordion.controls.description')}</p>
              <ul className="list-disc pl-4 space-y-2">
                {controlsContent.map((control: string, index: number) => (
                  <li key={index}>{control}</li>
                ))}
                <li>触摸设备：滑动屏幕控制方向</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="scoring">
            <AccordionTrigger>{t('accordion.scoring.title')}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                {scoringContent.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="strategy">
            <AccordionTrigger>{t('accordion.strategy.title')}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                {strategyContent.map((tip: string, index: number) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <DifficultySettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        currentConfig={currentConfig}
        onConfigChange={handleConfigChange}
      />
    </div>
  )
} 