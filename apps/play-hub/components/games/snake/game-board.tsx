'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GameControls } from './game-controls'
import {
  CellType,
  DIFFICULTIES,
  Difficulty,
  Direction,
  DIRECTIONS,
  GameStatus,
  INITIAL_SNAKE,
  Position
} from './types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES.easy)
  const [board, setBoard] = useState<CellType[][]>([])
  const [snake, setSnake] = useState<Position[]>([...INITIAL_SNAKE])
  const [food, setFood] = useState<Position | null>(null)
  const lastDirectionRef = useRef<Direction>('right')
  const isMovingRef = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle')
  const [score, setScore] = useState(0)

  // 初始化游戏板
  const initializeBoard = useCallback(() => {
    const newBoard: CellType[][] = Array(difficulty.boardSize)
      .fill(null)
      .map(() => Array(difficulty.boardSize).fill('empty'))
    return newBoard
  }, [difficulty.boardSize])

  // 生成食物
  const generateFood = useCallback((currentSnake: Position[]) => {
    const newFood: Position = {
      row: Math.floor(Math.random() * difficulty.boardSize),
      col: Math.floor(Math.random() * difficulty.boardSize)
    }
    // 确保食物不会生成在蛇身上
    if (currentSnake.some(pos => pos.row === newFood.row && pos.col === newFood.col)) {
      return generateFood(currentSnake)
    }
    return newFood
  }, [difficulty.boardSize])

  // 重置游戏
  const resetGame = useCallback(() => {
    const newBoard = initializeBoard()
    const initialSnake = [...INITIAL_SNAKE]
    const newFood = generateFood(initialSnake)
    
    setBoard(newBoard)
    setSnake(initialSnake)
    setFood(newFood)
    lastDirectionRef.current = 'right'
    isMovingRef.current = false
    setGameStatus('idle')
    setScore(0)
  }, [initializeBoard, generateFood])

  // 更新游戏板
  const updateBoard = useCallback(() => {
    const newBoard = initializeBoard()
    
    // 放置蛇
    snake.forEach(pos => {
      if (
        pos.row >= 0 &&
        pos.row < difficulty.boardSize &&
        pos.col >= 0 &&
        pos.col < difficulty.boardSize
      ) {
        newBoard[pos.row][pos.col] = 'snake'
      }
    })
    
    // 放置食物
    if (food) {
      newBoard[food.row][food.col] = 'food'
    }
    
    setBoard(newBoard)
  }, [initializeBoard, snake, food, difficulty.boardSize])

  // 移动蛇
  const moveSnake = useCallback(() => {
    if (gameStatus !== 'playing') return

    const head = snake[0]
    const newHead: Position = { ...head }
    const currentDirection = lastDirectionRef.current

    // 根据方向移动蛇头
    switch (currentDirection) {
      case 'up':
        newHead.row--
        break
      case 'down':
        newHead.row++
        break
      case 'left':
        newHead.col--
        break
      case 'right':
        newHead.col++
        break
    }

    // 检查是否撞墙
    if (
      newHead.row < 0 ||
      newHead.row >= difficulty.boardSize ||
      newHead.col < 0 ||
      newHead.col >= difficulty.boardSize
    ) {
      setGameStatus('gameover')
      return
    }

    // 预先检查是否会撞到自己
    if (snake.some(pos => pos.row === newHead.row && pos.col === newHead.col)) {
      setGameStatus('gameover')
      return
    }

    const newSnake = [newHead]

    // 检查是否吃到食物
    if (food && newHead.row === food.row && newHead.col === food.col) {
      // 吃到食物，蛇身增长
      newSnake.push(...snake)
      setScore(prev => prev + 10)
      // 使用当前的新蛇身生成食物
      setFood(generateFood(newSnake))
    } else {
      // 没吃到食物，移动蛇身
      newSnake.push(...snake.slice(0, -1))
    }

    setSnake(newSnake)
    isMovingRef.current = false
  }, [gameStatus, snake, difficulty.boardSize, food, generateFood])

  // 处理方向改变
  const handleDirectionChange = useCallback((newDirection: Direction) => {
    if (gameStatus !== 'playing' || isMovingRef.current) return

    // 防止反向移动和对角线移动
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    }
    
    // 检查是否是有效的方向改变
    const isValidDirectionChange = () => {
      const currentDir = lastDirectionRef.current
      // 不允许反向移动
      if (opposites[newDirection] === currentDir) return false
      // 确保只能改变一个方向
      if (currentDir === 'up' || currentDir === 'down') {
        return newDirection === 'left' || newDirection === 'right'
      }
      if (currentDir === 'left' || currentDir === 'right') {
        return newDirection === 'up' || newDirection === 'down'
      }
      return true
    }

    if (isValidDirectionChange()) {
      isMovingRef.current = true
      lastDirectionRef.current = newDirection
    }
  }, [gameStatus])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newDirection = DIRECTIONS[event.code]
      if (!newDirection) return

      // 阻止方向键和WASD键的默认行为
      event.preventDefault()
      handleDirectionChange(newDirection)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDirectionChange])

  // 触摸控制
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (gameStatus !== 'playing') return
    
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    }
  }, [gameStatus])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || gameStatus !== 'playing') return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    
    // 确保滑动距离足够长，避免误触
    const minSwipeDistance = 30
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) return
    
    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      handleDirectionChange(deltaX > 0 ? 'right' : 'left')
    } else {
      // 垂直滑动
      handleDirectionChange(deltaY > 0 ? 'down' : 'up')
    }
    
    // 重置触摸起点，允许连续滑动
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    }
  }, [gameStatus, handleDirectionChange])

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null
  }, [])

  // 游戏循环
  useEffect(() => {
    let gameLoop: NodeJS.Timeout
    if (gameStatus === 'playing') {
      gameLoop = setInterval(moveSnake, difficulty.speed)
    }
    return () => clearInterval(gameLoop)
  }, [gameStatus, difficulty.speed, moveSnake])

  // 更新游戏板
  useEffect(() => {
    updateBoard()
  }, [snake, food, updateBoard])

  // 初始化游戏
  useEffect(() => {
    resetGame()
  }, [difficulty, resetGame])

  const t = useTranslations('snake')

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[500px]">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      
      <GameControls
        difficulty={difficulty}
        gameStatus={gameStatus}
        score={score}
        onDifficultyChange={setDifficulty}
        onStart={() => setGameStatus('playing')}
        onReset={resetGame}
      />

      <div
        className={cn(
          'relative w-full aspect-square',
          'rounded-lg bg-[#bbada0] p-3 md:p-4',
          'touch-none select-none'
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {(gameStatus === 'gameover') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg z-50">
            <div className="text-4xl font-bold text-white mb-4">
              {t('game.gameOver')}
            </div>
            <div className="text-lg text-white mb-4">
              {t('game.score')}: {score}
            </div>
            <Button
              onClick={resetGame}
              variant="secondary"
              className="bg-white hover:bg-gray-100"
            >
              {t('game.restart')}
            </Button>
          </div>
        )}
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${difficulty.boardSize}, 1fr)`
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'aspect-square rounded-sm',
                  cell === 'empty' && 'bg-gray-200 dark:bg-gray-700',
                  cell === 'snake' && 'bg-green-500',
                  cell === 'food' && 'bg-red-500'
                )}
              />
            ))
          )}
        </div>
      </div>

      <div className="w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="rules">
            <AccordionTrigger>{t('accordion.rules.title')}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>{t('accordion.rules.content.1')}</li>
                <li>{t('accordion.rules.content.2')}</li>
                <li>{t('accordion.rules.content.3')}</li>
                <li>{t('accordion.rules.content.4')}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="controls">
            <AccordionTrigger>{t('accordion.controls.title')}</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">{t('accordion.controls.description')}</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>{t('accordion.controls.content.1')}</li>
                <li>{t('accordion.controls.content.2')}</li>
                <li>{t('accordion.controls.content.3')}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="scoring">
            <AccordionTrigger>{t('accordion.scoring.title')}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>{t('accordion.scoring.content.1')}</li>
                <li>{t('accordion.scoring.content.2')}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="strategy">
            <AccordionTrigger>{t('accordion.strategy.title')}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>{t('accordion.strategy.content.1')}</li>
                <li>{t('accordion.strategy.content.2')}</li>
                <li>{t('accordion.strategy.content.3')}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
} 