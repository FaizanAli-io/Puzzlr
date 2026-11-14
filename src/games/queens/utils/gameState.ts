import type { Cell, CellState, Coord } from '../types'

import { checkAndReturnGameSize, getCheckResult } from '@/utils/helper'
import { getUnits } from '@/utils/units'
import { GameSolver } from '../utils/gameSolver'

export function resetGame(grid: Cell[][] | CellState[][]): CellState[][] {
  return grid.map((row) =>
    row.map((cell) => ({
      region: typeof cell === 'string' ? cell : cell.region,
      isClicked: false,
      highlight: false,
      conflict: false,
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

  const regionIndex = new Map(
    [...new Set(grid.flat().map((cell) => cell.region))].map((region, i) => [
      region,
      i,
    ]),
  )

  const { rowT, colT, groupT } = getUnits(grid, (cell) =>
    regionIndex.get(cell.region)!,
  )

  const findConflicts = (units: CellState[][]) =>
    units.flatMap((unit) => {
      const queens = unit.filter((cell) => cell.isClicked)
      return queens.length > 1 ? queens : []
    })

  const diagConflicts = grid.flatMap((row, i) =>
    row.filter(
      (cell, j) =>
        cell.isClicked &&
        [-1, 1].some((di) =>
          [-1, 1].some((dj) => grid[i + di]?.[j + dj]?.isClicked),
        ),
    ),
  )

  const queensLeft =
    gridSize - grid.flat().filter((cell) => cell.isClicked).length

  const { conflicts, ...result } = getCheckResult(
    [
      [findConflicts(rowT), 'Rows cannot contain more than one Queen'],
      [findConflicts(colT), 'Columns cannot contain more than one Queen'],
      [findConflicts(groupT), 'Regions cannot contain more than one Queen'],
      [diagConflicts, 'No two Queens can be diagonally adjacent'],
    ],
    queensLeft
      ? `No conflicts so far, ${queensLeft} Queens left to place.`
      : '',
  )

  return {
    ...result,
    newGrid: grid.map((row) =>
      row.map((cell) => ({ ...cell, conflict: conflicts.has(cell) })),
    ),
  }
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
  newGrid.flat().forEach((cell) => (cell.conflict = false))
  for (const [i, j] of solution) {
    newGrid[i][j].highlight = true
  }

  return newGrid
}
