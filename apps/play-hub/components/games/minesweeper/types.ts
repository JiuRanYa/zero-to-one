export type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type Difficulty = {
  name: string;
  label: string;
  rows: number;
  cols: number;
  mines: number;
};

export const DIFFICULTIES: Record<string, Difficulty> = {
  beginner: {
    name: 'beginner',
    label: '初级',
    rows: 9,
    cols: 9,
    mines: 10,
  },
  intermediate: {
    name: 'intermediate',
    label: '中级',
    rows: 16,
    cols: 16,
    mines: 40,
  },
  expert: {
    name: 'expert',
    label: '高级',
    rows: 16,
    cols: 30,
    mines: 99,
  },
} 