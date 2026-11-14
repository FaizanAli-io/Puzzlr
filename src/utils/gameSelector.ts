import type { Game as QueensGame } from '@/games/queens/types'
import type { Game as SudokuGame } from '@/games/sudoku/types'
import type { GameOptions } from '@/types'

import queensGames from '../games/queens/games.json'
import sudokuGames from '../games/sudoku/games.json'

const games = {
  queens: queensGames as QueensGame[],
  sudoku: sudokuGames as SudokuGame[],
}

export const getGameList = (type: GameOptions) => games[type]

export function getGame(type: 'queens', index: number): QueensGame
export function getGame(type: 'sudoku', index: number): SudokuGame
export function getGame(type: GameOptions, index: number) {
  return games[type][index]
}
