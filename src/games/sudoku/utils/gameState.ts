import type { CellState, GridSize } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'

import { GameSolver } from './gameSolver'

export function resetGame(grid: number[][] | CellState[][]): CellState[][] {
  const gridSize = checkAndReturnGameSize(grid) as GridSize

  const mapper = {
    6: (i: number, j: number) => Math.floor(j / 3) + Math.floor(i / 2) * 2,
    9: (i: number, j: number) => Math.floor(j / 3) + Math.floor(i / 3) * 3,
  }[gridSize]

  return grid.map((row, i) =>
    row.map((cell, j) => {
      let fixed, value

      if (typeof cell === 'number') {
        fixed = cell !== 0
        value = cell
      } else {
        fixed = cell.fixed
        value = fixed ? cell.value : 0
      }

      return {
        fixed,
        value,
        note: 0,
        box: mapper(i, j),
      }
    }),
  )
}

export function printGame(grid: CellState[][]) {
  return JSON.stringify(
    grid.map((row, i) => row.map((cell, j) => [cell.value, i, j])),
    null,
    2,
  )
}

export function checkGame(grid: CellState[][]) {
  return { isValid: true, message: 'Not implemented yet.' }
}

export function solveGame(grid: CellState[][]) {
  const { result, solution, metadata } = new GameSolver(grid).solve()

  const message = `${result ? 'A' : 'No'} solution was found for this game.`

  return {
    isValid: result,
    message: message,
    newGrid: structuredClone(grid).map((row, i) =>
      row.map((cell, j) => ({
        ...cell,
        note: cell.fixed ? cell.value : solution[i][j],
      })),
    ),
  }
}
