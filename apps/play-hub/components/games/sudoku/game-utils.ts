type Board = (number | null)[][]
type Position = [number, number]

export type Difficulty = 'easy' | 'medium' | 'hard'

const BOARD_SIZE = 9
const GRID_SIZE = 3

// 检查数字在指定位置是否有效
export function isValid(board: Board, pos: Position, num: number): boolean {
  const [row, col] = pos

  // 检查行
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[row][x] === num) return false
  }

  // 检查列
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[x][col] === num) return false
  }

  // 检查3x3方格
  const boxRow = Math.floor(row / GRID_SIZE) * GRID_SIZE
  const boxCol = Math.floor(col / GRID_SIZE) * GRID_SIZE
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false
    }
  }

  return true
}

// 找到空位置
function findEmpty(board: Board): Position | null {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === null) {
        return [i, j]
      }
    }
  }
  return null
}

// 计算解的数量
function countSolutions(board: Board): number {
  let count = 0
  const empty = findEmpty(board)
  
  // 如果没有空位置，说明找到了一个解
  if (!empty) return 1
  
  const [row, col] = empty
  // 尝试填入1-9
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, [row, col], num)) {
      board[row][col] = num
      count += countSolutions(board)
      if (count > 1) break // 如果已经找到多个解，提前返回
      board[row][col] = null
    }
  }
  
  return count
}

// 检查是否只有唯一解
function hasUniqueSolution(board: Board): boolean {
  const boardCopy = board.map(row => [...row])
  return countSolutions(boardCopy) === 1
}

// 生成完整的数独解决方案
function generateSolution(): Board {
  const board: Board = Array(BOARD_SIZE).fill(null)
    .map(() => Array(BOARD_SIZE).fill(null))

  // 生成对角线上的3个3x3方格
  for (let i = 0; i < BOARD_SIZE; i += GRID_SIZE) {
    const nums = Array.from({length: 9}, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        board[i + row][i + col] = nums[row * GRID_SIZE + col]
      }
    }
  }

  // 解决剩余的格子
  solveSudoku(board)
  return board
}

// 根据难度移除数字
function removeNumbers(board: Board, difficulty: Difficulty): Board {
  const cellsToKeep = {
    easy: 45,
    medium: 35,
    hard: 25
  }

  const result = board.map(row => [...row])
  const positions = Array(BOARD_SIZE * BOARD_SIZE).fill(null)
    .map((_, i) => [Math.floor(i / BOARD_SIZE), i % BOARD_SIZE] as Position)
    .sort(() => Math.random() - 0.5)

  let remainingCells = BOARD_SIZE * BOARD_SIZE
  let index = 0

  while (remainingCells > cellsToKeep[difficulty] && index < positions.length) {
    const [row, col] = positions[index]
    const temp = result[row][col]
    result[row][col] = null

    // 如果移除这个数字后不再是唯一解，就恢复它
    if (!hasUniqueSolution(result)) {
      result[row][col] = temp
    } else {
      remainingCells--
    }
    
    index++
  }

  return result
}

// 解数独
export function solveSudoku(board: Board): boolean {
  const empty = findEmpty(board)
  if (!empty) return true

  const [row, col] = empty
  const nums = Array.from({length: 9}, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5) // 随机化数字顺序，使生成的数独更随机

  for (const num of nums) {
    if (isValid(board, [row, col], num)) {
      board[row][col] = num
      if (solveSudoku(board)) return true
      board[row][col] = null
    }
  }

  return false
}

// 生成新游戏
export function generateGame(difficulty: Difficulty): Board {
  const solution = generateSolution()
  return removeNumbers(solution, difficulty)
}

// 验证当前游戏状态是否完成
export function isGameComplete(board: Board): boolean {
  // 检查是否有空格子
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === null) return false
    }
  }

  // 检查每行
  for (let row = 0; row < BOARD_SIZE; row++) {
    const nums = new Set(board[row])
    if (nums.size !== BOARD_SIZE) return false
  }

  // 检查每列
  for (let col = 0; col < BOARD_SIZE; col++) {
    const nums = new Set(board.map(row => row[col]))
    if (nums.size !== BOARD_SIZE) return false
  }

  // 检查每个3x3方格
  for (let boxRow = 0; boxRow < BOARD_SIZE; boxRow += GRID_SIZE) {
    for (let boxCol = 0; boxCol < BOARD_SIZE; boxCol += GRID_SIZE) {
      const nums = new Set()
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          nums.add(board[boxRow + i][boxCol + j])
        }
      }
      if (nums.size !== BOARD_SIZE) return false
    }
  }

  return true
}

// 检查是否是初始数字（不可修改）
export function isInitialNumber(board: Board, pos: Position): boolean {
  const [row, col] = pos
  return board[row][col] !== null
}

// 获取可能的数字列表
export function getPossibleNumbers(board: Board, pos: Position): number[] {
  const possible = []
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, pos, num)) {
      possible.push(num)
    }
  }
  return possible
}

// 排行榜记录类型
export interface LeaderboardRecord {
  difficulty: Difficulty
  timeInSeconds: number
  date: string
}

// 获取排行榜数据
export function getLeaderboard(): LeaderboardRecord[] {
  const data = localStorage.getItem('sudoku-leaderboard')
  return data ? JSON.parse(data) : []
}

// 保存排行榜数据
export function saveLeaderboard(records: LeaderboardRecord[]) {
  localStorage.setItem('sudoku-leaderboard', JSON.stringify(records))
}

// 添加新记录到排行榜
export function addLeaderboardRecord(record: LeaderboardRecord) {
  const records = getLeaderboard()
  records.push(record)
  // 按时间升序排序
  records.sort((a, b) => a.timeInSeconds - b.timeInSeconds)
  // 只保留前10名
  const topRecords = records.slice(0, 10)
  saveLeaderboard(topRecords)
  return topRecords
} 