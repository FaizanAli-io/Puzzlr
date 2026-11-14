import type { Dispatch, SetStateAction } from 'react'

export type StateProps<T, K extends string> = {
  [P in K]: T
} & {
  [P in `set${Capitalize<K>}`]: Dispatch<SetStateAction<T>>
}

export type GameOptions = 'queens' | 'sudoku'

export type GameListItem = {
  id: number
  size: number
}

export type GameSelectorProps = {
  type: GameOptions
  selectedGame: number
  onChange: (index: number) => void
}

type GameResult = {
  isValid: boolean | undefined
  message: string
}

export type GameControllerProps<T> = StateProps<T, 'grid'> & {
  gameUtils: {
    resetGame: (grid: T) => T
    printGame: (grid: T) => string
    checkGame: (grid: T) => GameResult & { newGrid?: T }
    solveGame: (grid: T) => GameResult & { newGrid: T }
  }
}
