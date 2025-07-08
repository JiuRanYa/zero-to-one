'use client'

import { useCallback, useEffect, useState } from 'react'
import { Cell } from './cell'
import { GameControls } from './game-controls'
import { CellState, DIFFICULTIES, Difficulty, GameStatus } from './types'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

export function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES.beginner)
  const [board, setBoard] = useState<CellState[][]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [remainingMines, setRemainingMines] = useState(difficulty.mines)

  const initializeBoard = useCallback(() => {
    const newBoard: CellState[][] = Array(difficulty.rows)
      .fill(null)
      .map(() =>
        Array(difficulty.cols).fill(null).map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        }))
      )

    // 随机放置地雷
    let minesPlaced = 0
    while (minesPlaced < difficulty.mines) {
      const row = Math.floor(Math.random() * difficulty.rows)
      const col = Math.floor(Math.random() * difficulty.cols)
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    // 计算每个格子周围的地雷数
    for (let row = 0; row < difficulty.rows; row++) {
      for (let col = 0; col < difficulty.cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i
              const newCol = col + j
              if (
                newRow >= 0 &&
                newRow < difficulty.rows &&
                newCol >= 0 &&
                newCol < difficulty.cols &&
                newBoard[newRow][newCol].isMine
              ) {
                count++
              }
            }
          }
          newBoard[row][col].neighborMines = count
        }
      }
    }

    return newBoard
  }, [difficulty])

  const resetGame = useCallback(() => {
    setBoard(initializeBoard())
    setGameStatus('idle')
    setTimeElapsed(0)
    setRemainingMines(difficulty.mines)
  }, [difficulty, initializeBoard])

  useEffect(() => {
    resetGame()
  }, [difficulty, resetGame])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameStatus === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameStatus])

  const revealCell = (row: number, col: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return

    const newBoard = [...board]
    const cell = newBoard[row][col]

    if (cell.isFlagged || cell.isRevealed) return

    if (gameStatus === 'idle') {
      setGameStatus('playing')
    }

    cell.isRevealed = true

    if (cell.isMine) {
      // 游戏结束，显示所有地雷
      newBoard.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) cell.isRevealed = true
        })
      )
      setGameStatus('lost')
    } else if (cell.neighborMines === 0) {
      // 如果是空格，递归显示周围的格子
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i
          const newCol = col + j
          if (
            newRow >= 0 &&
            newRow < difficulty.rows &&
            newCol >= 0 &&
            newCol < difficulty.cols &&
            !newBoard[newRow][newCol].isRevealed &&
            !newBoard[newRow][newCol].isFlagged
          ) {
            revealCell(newRow, newCol)
          }
        }
      }
    }

    setBoard(newBoard)

    // 检查是否胜利
    const hasWon = newBoard.every((row) =>
      row.every((cell) => cell.isMine ? !cell.isRevealed : cell.isRevealed)
    )
    if (hasWon) {
      setGameStatus('won')
    }
  }

  const toggleFlag = (row: number, col: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost' || board[row][col].isRevealed) return

    const newBoard = [...board]
    const cell = newBoard[row][col]

    if (gameStatus === 'idle') {
      setGameStatus('playing')
    }

    if (!cell.isFlagged && remainingMines === 0) return

    cell.isFlagged = !cell.isFlagged
    setRemainingMines((prev) => prev + (cell.isFlagged ? -1 : 1))
    setBoard(newBoard)
  }

  const t = useTranslations('minesweeper')

  return (
    <div className="flex flex-col items-center w-full max-w-[800px] mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">{t('title')}</h1>
      <GameControls
        difficulty={difficulty}
        gameStatus={gameStatus}
        remainingMines={remainingMines}
        timeElapsed={timeElapsed}
        onDifficultyChange={setDifficulty}
        onReset={resetGame}
      />
      <div
        className={cn(
          'relative w-full',
          'rounded-lg bg-[#bbada0] p-3 md:p-4',
          'touch-none select-none'
        )}
        style={{
          maxWidth: `${difficulty.cols * 32}px`,
        }}
      >
        {(gameStatus === 'won' || gameStatus === 'lost') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg z-50">
            <div className="text-4xl font-bold text-white mb-4">
              {gameStatus === 'won' ? t('game.youWin') : t('game.gameOver')}
            </div>
            <div className="text-lg text-white mb-4">
              {t('game.time')}: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
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
          className="grid gap-[2px] bg-gray-300"
          style={{
            gridTemplateColumns: `repeat(${difficulty.cols}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                state={cell}
                onClick={() => revealCell(rowIndex, colIndex)}
                onRightClick={() => toggleFlag(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
} 