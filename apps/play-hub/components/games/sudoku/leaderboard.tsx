'use client'

import { useEffect, useState } from 'react'
import { LeaderboardRecord, getLeaderboard, Difficulty } from './game-utils'

interface LeaderboardProps {
  currentDifficulty: Difficulty
}

export function Leaderboard({ currentDifficulty }: LeaderboardProps) {
  const [records, setRecords] = useState<LeaderboardRecord[]>([])

  useEffect(() => {
    // 初始加载排行榜数据
    setRecords(getLeaderboard().filter(record => record.difficulty === currentDifficulty))

    // 监听storage事件，当其他标签页更新排行榜时同步更新
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sudoku-leaderboard') {
        setRecords(getLeaderboard().filter(record => record.difficulty === currentDifficulty))
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [currentDifficulty])

  // 格式化时间
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        {currentDifficulty === 'easy' ? '简单' : currentDifficulty === 'medium' ? '中等' : '困难'}
        模式排行榜
      </h2>
      <div className="space-y-2">
        {records.map((record, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border-b border-gray-100"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-600">#{index + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono">{formatTime(record.timeInSeconds)}</span>
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            暂无记录
          </div>
        )}
      </div>
    </div>
  )
} 