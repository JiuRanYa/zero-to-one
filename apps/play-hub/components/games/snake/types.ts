export type Position = {
  row: number;
  col: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'idle' | 'playing' | 'gameover';

export type CellType = 'empty' | 'snake' | 'food';

export type Difficulty = {
  name: string;
  label: string;
  speed: number;
  boardSize: number;
};

export const DIFFICULTIES: Record<string, Difficulty> = {
  easy: {
    name: 'easy',
    label: '简单',
    speed: 200,
    boardSize: 15,
  },
  normal: {
    name: 'normal',
    label: '普通',
    speed: 150,
    boardSize: 20,
  },
  hard: {
    name: 'hard',
    label: '困难',
    speed: 100,
    boardSize: 25,
  },
}

export const INITIAL_SNAKE: Position[] = [
  { row: 7, col: 7 },
  { row: 7, col: 6 },
  { row: 7, col: 5 },
]

export const DIRECTIONS: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
} 