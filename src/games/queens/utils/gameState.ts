import type { Cell, CellState, Coord } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'
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

  const findConflicts = (units: CellState[][]) =>
    units.flatMap((unit) => {
      const queens = unit.filter((cell) => cell.isClicked)
      return queens.length > 1 ? queens : []
    })

  const rowConflicts = findConflicts(rowT)
  const colConflicts = findConflicts(colT)
  const regionConflicts = findConflicts(groupT)

  const diagConflicts = grid.flatMap((row, i) =>
    row.filter(
      (cell, j) =>
        cell.isClicked &&
        getDiagonalNeighbors(i, j).some(([x, y]) => grid[x][y].isClicked),
    ),
  )

  const conflicts = new Set([
    ...rowConflicts,
    ...colConflicts,
    ...regionConflicts,
    ...diagConflicts,
  ])

  const queensLeft =
    gridSize - grid.flat().filter((cell) => cell.isClicked).length

  const newGrid = grid.map((row) =>
    row.map((cell) => ({ ...cell, conflict: conflicts.has(cell) })),
  )

  if (conflicts.size > 0)
    return {
      isValid: false,
      message: [
        rowConflicts.length > 0 && 'Rows cannot contain more than one Queen',
        colConflicts.length > 0 && 'Columns cannot contain more than one Queen',
        regionConflicts.length > 0 &&
          'Regions cannot contain more than one Queen',
        diagConflicts.length > 0 && 'No two Queens can be diagonally adjacent',
      ]
        .filter((x) => x !== false)
        .join('\n'),
      newGrid,
    }

  if (queensLeft > 0)
    return {
      isValid: undefined,
      message: `No conflicts so far, ${queensLeft} Queens left to place.`,
      newGrid,
    }

  return {
    isValid: true,
    message: 'Congratulations, you solved the puzzle!',
    newGrid,
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
