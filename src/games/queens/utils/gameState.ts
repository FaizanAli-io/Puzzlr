import type { Cell, CellState, Coord } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'
import { GameSolver } from '../utils/gameSolver'

export function resetGame(grid: Cell[][] | CellState[][]): CellState[][] {
  return grid.map((row) =>
    row.map((cell) => ({
      region: typeof cell === 'string' ? cell : cell.region,
      isClicked: false,
      highlight: false,
    })),
  )
}

export function printGame(grid: CellState[][]) {
  return JSON.stringify(
    grid
      .flatMap((row, i) => row.map((cell, j) => cell.isClicked && [i, j]))
      .filter((x) => x),
    null,
    2,
  )
}

export function checkGame(grid: CellState[][]) {
  const gridSize = checkAndReturnGameSize(grid)

  const clickedToNum = (cell: CellState) => Number(cell.isClicked)

  const getDiagonalNeighbors = (i: number, j: number): Coord[] => {
    return (
      [
        [i + 1, j + 1],
        [i + 1, j - 1],
        [i - 1, j + 1],
        [i - 1, j - 1],
      ] satisfies Coord[]
    ).filter(([r, c]) => r >= 0 && c >= 0 && r < gridSize && c < gridSize)
  }

  const regions: Partial<Record<Cell, number>> = {}

  grid.forEach((row) =>
    row.forEach((cell) => {
      regions[cell.region] = (regions[cell.region] ?? 0) + clickedToNum(cell)
    }),
  )

  const regionCheck =
    Object.keys(regions).length === gridSize &&
    Object.values(regions).every((count) => count === 1)

  const rowCheck = grid.every(
    (row) => row.reduce((a, b) => a + clickedToNum(b), 0) === 1,
  )

  const colCheck = grid[0].every(
    (_, i) => grid.reduce((a, b) => a + clickedToNum(b[i]), 0) === 1,
  )

  const diagCheck = grid.every((row, i) =>
    row.every(
      (cell, j) =>
        !(
          cell.isClicked &&
          getDiagonalNeighbors(i, j).some(([x, y]) => grid[x][y].isClicked)
        ),
    ),
  )

  const isValid = regionCheck && rowCheck && colCheck && diagCheck

  const message = isValid
    ? 'Congratulations, you solved the puzzle!'
    : [
        !regionCheck && 'All regions must have exactly one Queen',
        !rowCheck && 'All rows must have exactly one Queen',
        !colCheck && 'All columns must have exactly one Queen',
        !diagCheck && 'No Two Queens can be diagonally adjacent',
      ]
        .filter((x) => x !== false)
        .join('\n')

  return { isValid, message }
}

export function solveGame(grid: CellState[][]) {
  const { result, solution, metadata } = new GameSolver(grid).solve()

  const { duration, steps } = metadata
  const statistics = `${duration} ms after ${steps} steps`
  const message = `${result ? 'A' : 'No'} solution was found for this game in ${statistics}.`

  return {
    isValid: result,
    message: message,
    newGrid: highlightCells(grid, solution),
  }
}

function highlightCells(grid: CellState[][], solution: Coord[]) {
  const newGrid = structuredClone(grid)
  for (const [i, j] of solution) {
    newGrid[i][j].highlight = true
  }

  return newGrid
}
