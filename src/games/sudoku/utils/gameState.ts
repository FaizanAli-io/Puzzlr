import type { CellState, GridSize } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'

export function resetGame(grid: number[][] | CellState[][]): CellState[][] {
  const gridSize = checkAndReturnGameSize(grid) as GridSize

  const mapper = {
    6: (i: number, j: number) => Math.floor(j / 3) + Math.floor(i / 2) * 2,
    9: (i: number, j: number) => Math.floor(j / 3) + Math.floor(i / 3) * 3,
  }[gridSize]

  return grid.map((row, i) =>
    row.map((cell, j) => {
      const value = typeof cell === 'number' ? cell : cell.value

      return {
        region: mapper(i, j),
        value: value,
        fixed: value !== 0,
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
  return {
    isValid: true,
    message: 'Not implemented yet.',
    newGrid: grid,
  }
}
