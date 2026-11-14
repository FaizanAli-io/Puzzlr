import type { Dispatch, SetStateAction } from 'react'

export type StateProps<T, K extends string> = {
  [P in K]: T
} & {
  [P in `set${Capitalize<K>}`]: Dispatch<SetStateAction<T>>
}

export const GAME_OPTIONS = ['queens', 'sudoku'] as const

export type GameOptions = (typeof GAME_OPTIONS)[number]

export type GameSelectorProps = {
  type: GameOptions
  selectedGame: number
  onChange: (index: number) => void
}

export type GameResult = {
  isValid: boolean | undefined
  message: string
}

export type GameUtils<T> = {
  resetGame: (grid: T) => T
  printGame: (grid: T) => string
  parseGame: (input: unknown) => T
  checkGame: (grid: T) => GameResult & { newGrid?: T }
  solveGame: (grid: T) => GameResult & { newGrid: T }
}

export type GameActions = Record<
  'reset' | 'print' | 'check' | 'solve',
  () => string
>
