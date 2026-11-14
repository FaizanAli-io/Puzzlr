import type { Dispatch, SetStateAction } from 'react'

import type { CellState as QueensGrid } from '@/games/queens/types'
import type { CellState as SudokuGrid } from '@/games/sudoku/types'
import type { GameActions, GameOptions } from '@/types'

// What is currently on screen, published for anything that wants to observe or
// drive the app from outside the component tree.

export type GameSession<K extends GameOptions, T> = {
  type: K
  schema: object
  selectedGame: number
  changeGame: (index: number) => void
  importGame: (grid: T) => void
  parseGame: (input: unknown) => T
  grid: T
  setGrid: Dispatch<SetStateAction<T>>
  actions: GameActions
}

export type QueensSession = GameSession<'queens', QueensGrid[][]>

export type SudokuSession = GameSession<'sudoku', SudokuGrid[][]>

export type AnyGameSession = QueensSession | SudokuSession

export type Session = {
  app?: { openGame: (game: GameOptions) => void; closeGame: () => void }
  game?: AnyGameSession
}

let session: Session = {}

const listeners = new Set<() => void>()

export const getSession = () => session

export const subscribeSession = (listener: () => void) => {
  listeners.add(listener)

  return () => void listeners.delete(listener)
}

export const updateSession = (patch: Session) => {
  session = { ...session, ...patch }
  listeners.forEach((listener) => listener())
}
