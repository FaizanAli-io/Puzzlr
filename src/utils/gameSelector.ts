import type { Game as QueensGame } from '@/games/queens/types'
import type { Game as SudokuGame } from '@/games/sudoku/types'
import type { GameListItem, GameOptions } from '@/types'

import queensGames from '../games/queens/games.json'
import sudokuGames from '../games/sudoku/games.json'

export class GameSelector {
  private constructor() {}

  private static readonly games = {
    queens: queensGames as QueensGame[],
    sudoku: sudokuGames as SudokuGame[],
  }

  public static getGameList(type: GameOptions): GameListItem[] {
    return this.games[type].map(({ id, size }) => ({ id, size }))
  }

  public static getGame(type: 'queens', index: number): QueensGame
  public static getGame(type: 'sudoku', index: number): SudokuGame
  public static getGame(
    type: GameOptions,
    index: number,
  ): QueensGame | SudokuGame {
    return this.games[type][index]
  }
}
