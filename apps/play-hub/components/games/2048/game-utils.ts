export interface Tile {
  id: string;
  value: number;
  position: {
    row: number;
    col: number;
  };
  mergedFrom?: Tile[];
  isNew: boolean;
}

export interface GameConfig {
  FOUR_PROBABILITY: number; // 生成数字4的概率
  INITIAL_TILES: number;    // 初始方块数量
  GRID_SIZE: number;        // 网格大小
  WIN_VALUE: number;      // 获胜数值
}

export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert' | 'custom'

export const DIFFICULTY_PRESETS: Record<Exclude<Difficulty, 'custom'>, GameConfig> = {
  easy: {
    FOUR_PROBABILITY: 0.0,
    INITIAL_TILES: 2,
    GRID_SIZE: 4,
    WIN_VALUE: 2048
  },
  normal: {
    FOUR_PROBABILITY: 0.1,
    INITIAL_TILES: 2,
    GRID_SIZE: 4,
    WIN_VALUE: 2048
  },
  hard: {
    FOUR_PROBABILITY: 0.3,
    INITIAL_TILES: 3,
    GRID_SIZE: 5,
    WIN_VALUE: 2048
  },
  expert: {
    FOUR_PROBABILITY: 0.4,
    INITIAL_TILES: 4,
    GRID_SIZE: 6,
    WIN_VALUE: 4096
  }
}

// 默认游戏配置
export const DEFAULT_GAME_CONFIG: GameConfig = DIFFICULTY_PRESETS.normal

// 当前游戏配置
export let GAME_CONFIG: GameConfig = { ...DEFAULT_GAME_CONFIG }

// 更新游戏配置
export function updateGameConfig(newConfig: Partial<GameConfig>) {
  GAME_CONFIG = { ...GAME_CONFIG, ...newConfig }
}

// 生成唯一ID的辅助函数
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 创建新的Tile对象
export function createTile(position: { row: number; col: number }, value: number, isNew: boolean = false): Tile {
  return {
    id: generateId(),
    value,
    position,
    isNew,
  }
}

// 初始化空网格
export function createEmptyGrid(): (Tile | null)[][] {
  return Array(GAME_CONFIG.GRID_SIZE).fill(null).map(() => Array(GAME_CONFIG.GRID_SIZE).fill(null))
}

// 在空位置随机生成数字（2或4）
export function generateNumber(grid: (Tile | null)[][]): (Tile | null)[][] {
  const position = getRandomEmptyPosition(grid)
  if (!position) return grid
  
  const newGrid = grid.map(row => [...row])
  newGrid[position.row][position.col] = createTile(
    position,
    Math.random() < (1 - GAME_CONFIG.FOUR_PROBABILITY) ? 2 : 4,
    true
  )
  
  return newGrid
}

// 初始化游戏
export function initializeGame(): (Tile | null)[][] {
  const grid = createEmptyGrid()
  
  // 添加初始数字
  for (let i = 0; i < GAME_CONFIG.INITIAL_TILES; i++) {
    const pos = getRandomEmptyPosition(grid)
    if (pos) {
      grid[pos.row][pos.col] = createTile(
        pos,
        Math.random() < (1 - GAME_CONFIG.FOUR_PROBABILITY) ? 2 : 4
      )
    }
  }
  
  return grid
}

function getRandomEmptyPosition(grid: (Tile | null)[][]): { row: number; col: number } | null {
  const emptyPositions: { row: number; col: number }[] = []
  
  grid.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (!tile) {
        emptyPositions.push({ row: i, col: j })
      }
    })
  })
  
  if (emptyPositions.length === 0) return null
  
  const randomIndex = Math.floor(Math.random() * emptyPositions.length)
  return emptyPositions[randomIndex]
}

// 压缩一行（去除空格）
function compress(row: Tile[]): Tile[] {
  return row.filter(cell => cell !== null)
}

// 合并相同的数字
function merge(row: Tile[]): [Tile[], number] {
  const compressed = compress(row)
  const merged: Tile[] = []
  let score = 0
  
  for (let i = 0; i < compressed.length; i++) {
    if (i < compressed.length - 1 && compressed[i].value === compressed[i + 1].value) {
      merged.push(createTile(
        compressed[i].position,
        compressed[i].value * 2
      ))
      merged[i].mergedFrom = [compressed[i], compressed[i + 1]]
      score += compressed[i].value * 2
      i++
    } else {
      merged.push(compressed[i])
    }
  }
  
  return [merged, score]
}

// 填充空格
function pad(row: Tile[], length: number): Tile[] {
  const padding = Array(length - row.length).fill(null)
  return [...row, ...padding]
}

// 移动和合并一行
export function moveRow(row: Tile[], direction: 'left' | 'right'): [Tile[], number] {
  const [merged, score] = merge(row)
  const padded = pad(merged, GAME_CONFIG.GRID_SIZE)
  return [direction === 'left' ? padded : padded.reverse(), score]
}

// 旋转矩阵（用于上下移动）
export function rotateGrid(grid: Tile[][]): Tile[][] {
  const size = GAME_CONFIG.GRID_SIZE
  const newGrid: Tile[][] = Array(size).fill(null).map(() => Array(size).fill(null))
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      newGrid[i][j] = grid[j][size - 1 - i]
    }
  }
  return newGrid
}

// 检查是否可以移动
export function canMove(grid: (Tile | null)[][]): boolean {
  const size = GAME_CONFIG.GRID_SIZE
  // 检查是否有空格
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!grid[i][j]) return true
    }
  }
  
  // 检查是否有相邻的相同数字
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const current = grid[i][j]?.value
      if (current) {
        if (
          (j < size - 1 && current === grid[i][j + 1]?.value) || // 右
          (i < size - 1 && current === grid[i + 1][j]?.value)    // 下
        ) {
          return true
        }
      }
    }
  }
  
  return false
}

// 检查是否胜利
export function hasWon(grid: (Tile | null)[][]): boolean {
  const size = GAME_CONFIG.GRID_SIZE
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j]?.value === GAME_CONFIG.WIN_VALUE) return true
    }
  }
  return false
}

// 执行移动操作
export function move(grid: (Tile | null)[][], direction: 'up' | 'down' | 'left' | 'right'): {
  grid: (Tile | null)[][];
  score: number;
  moved: boolean;
} {
  // 清除所有方块的isNew标记
  const gridWithoutNew = grid.map(row =>
    row.map(tile =>
      tile ? { ...tile, isNew: false } : null
    )
  )
  
  let totalScore = 0
  let moved = false
  const newGrid = gridWithoutNew.map(row => [...row])

  const moveLeft = () => {
    const size = GAME_CONFIG.GRID_SIZE
    for (let i = 0; i < size; i++) {
      let column = 0
      for (let j = 1; j < size; j++) {
        const tile = newGrid[i][j]
        if (!tile) continue
        
        let k = j
        
        while (k > column && !newGrid[i][k - 1]) {
          k--
        }
        
        if (k > column && newGrid[i][k - 1]?.value === tile.value) {
          const targetTile = newGrid[i][k - 1]
          if (!targetTile) continue

          const mergedTile = createTile(
            { row: i, col: k - 1 },
            tile.value * 2,
            false
          )
          mergedTile.mergedFrom = [targetTile, tile]
          
          newGrid[i][k - 1] = mergedTile
          newGrid[i][j] = null
          totalScore += mergedTile.value
          column = k
          moved = true
        } else if (k !== j) {
          tile.position = { row: i, col: k }
          newGrid[i][k] = tile
          newGrid[i][j] = null
          moved = true
        }
      }
    }
  }

  const moveRight = () => {
    const size = GAME_CONFIG.GRID_SIZE
    for (let i = 0; i < size; i++) {
      let column = size - 1
      for (let j = size - 2; j >= 0; j--) {
        const tile = newGrid[i][j]
        if (!tile) continue
        
        let k = j
        
        while (k < column && !newGrid[i][k + 1]) {
          k++
        }
        
        if (k < column && newGrid[i][k + 1]?.value === tile.value) {
          const targetTile = newGrid[i][k + 1]
          if (!targetTile) continue

          const mergedTile = createTile(
            { row: i, col: k + 1 },
            tile.value * 2,
            false
          )
          mergedTile.mergedFrom = [targetTile, tile]
          
          newGrid[i][k + 1] = mergedTile
          newGrid[i][j] = null
          totalScore += mergedTile.value
          column = k
          moved = true
        } else if (k !== j) {
          tile.position = { row: i, col: k }
          newGrid[i][k] = tile
          newGrid[i][j] = null
          moved = true
        }
      }
    }
  }

  const moveUp = () => {
    const size = GAME_CONFIG.GRID_SIZE
    for (let j = 0; j < size; j++) {
      let row = 0
      for (let i = 1; i < size; i++) {
        const tile = newGrid[i][j]
        if (!tile) continue
        
        let k = i
        
        while (k > row && !newGrid[k - 1][j]) {
          k--
        }
        
        if (k > row && newGrid[k - 1][j]?.value === tile.value) {
          const targetTile = newGrid[k - 1][j]
          if (!targetTile) continue

          const mergedTile = createTile(
            { row: k - 1, col: j },
            tile.value * 2,
            false
          )
          mergedTile.mergedFrom = [targetTile, tile]
          
          newGrid[k - 1][j] = mergedTile
          newGrid[i][j] = null
          totalScore += mergedTile.value
          row = k
          moved = true
        } else if (k !== i) {
          tile.position = { row: k, col: j }
          newGrid[k][j] = tile
          newGrid[i][j] = null
          moved = true
        }
      }
    }
  }

  const moveDown = () => {
    const size = GAME_CONFIG.GRID_SIZE
    for (let j = 0; j < size; j++) {
      let row = size - 1
      for (let i = size - 2; i >= 0; i--) {
        const tile = newGrid[i][j]
        if (!tile) continue
        
        let k = i
        
        while (k < row && !newGrid[k + 1][j]) {
          k++
        }
        
        if (k < row && newGrid[k + 1][j]?.value === tile.value) {
          const targetTile = newGrid[k + 1][j]
          if (!targetTile) continue

          const mergedTile = createTile(
            { row: k + 1, col: j },
            tile.value * 2,
            false
          )
          mergedTile.mergedFrom = [targetTile, tile]
          
          newGrid[k + 1][j] = mergedTile
          newGrid[i][j] = null
          totalScore += mergedTile.value
          row = k
          moved = true
        } else if (k !== i) {
          tile.position = { row: k, col: j }
          newGrid[k][j] = tile
          newGrid[i][j] = null
          moved = true
        }
      }
    }
  }

  switch (direction) {
    case 'left':
      moveLeft()
      break
    case 'right':
      moveRight()
      break
    case 'up':
      moveUp()
      break
    case 'down':
      moveDown()
      break
  }

  return { grid: newGrid, score: totalScore, moved }
}

// 游戏状态接口
export interface GameState {
  grid: (Tile | null)[][];
  score: number;
  gameOver: boolean;
  won: boolean;
}

// 保存游戏状态
export function saveGameState(state: GameState): void {
  try {
    // 确保每个Tile对象都包含完整的属性
    const processedGrid = state.grid.map(row =>
      row.map(tile =>
        tile ? {
          ...tile,
          isNew: false, // 保存时重置isNew状态
          mergedFrom: undefined // 不保存合并状态
        } : null
      )
    )
    
    const processedState = {
      ...state,
      grid: processedGrid
    }
    
    localStorage.setItem('2048_game_state', JSON.stringify(processedState))
  } catch (error) {
    console.error('Failed to save game state:', error)
  }
}

// 加载游戏状态
export function loadGameState(): GameState | null {
  try {
    const savedState = localStorage.getItem('2048_game_state')
    if (!savedState) return null

    const state = JSON.parse(savedState)
    
    // 重新创建Tile对象，确保所有必要的属性都存在
    const processedGrid = state.grid.map((row: (Tile | null)[], i: number) =>
      row.map((tile, j) => {
        if (!tile) return null
        return {
          id: tile.id || generateId(), // 如果没有id则生成新的
          value: tile.value,
          position: {
            row: i,
            col: j
          },
          isNew: false, // 加载时不显示为新块
          mergedFrom: undefined // 清除合并状态
        }
      })
    )

    return {
      ...state,
      grid: processedGrid
    }
  } catch (error) {
    console.error('Failed to load game state:', error)
    return null
  }
}

// 清除保存的游戏状态
export function clearGameState(): void {
  try {
    localStorage.removeItem('2048_game_state')
  } catch (error) {
    console.error('Failed to clear game state:', error)
  }
}