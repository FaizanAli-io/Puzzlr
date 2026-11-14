import type { CellState, GridSize } from '../types'

import { checkAndReturnGameSize, getCheckResult } from '@/utils/helper'
import { getUnits } from '@/utils/units'

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
        highlight: false,
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
  const { rowT, colT, groupT } = getUnits(grid, (cell) => cell.box)

  const findConflicts = (units: CellState[][]) =>
    units.flatMap((unit) =>
      unit.filter(
        (cell) =>
          cell.value !== 0 &&
          unit.some((other) => other !== cell && other.value === cell.value),
      ),
    )

  const emptyCells = grid.flat().filter((cell) => cell.value === 0).length

  const { conflicts, ...result } = getCheckResult(
    [
      [findConflicts(rowT), 'Rows cannot contain repeated numbers'],
      [findConflicts(colT), 'Columns cannot contain repeated numbers'],
      [findConflicts(groupT), 'Boxes cannot contain repeated numbers'],
    ],
    emptyCells ? `No conflicts so far, ${emptyCells} cells left.` : '',
  )

  return {
    ...result,
    newGrid: grid.map((row) =>
      row.map((cell) => ({ ...cell, highlight: conflicts.has(cell) })),
    ),
  }
}

export function solveGame(grid: CellState[][]) {
  const solver = new GameSolver(grid)

  let solved: ReturnType<typeof solver.solve>

  try {
    solved = solver.solve()
  } catch {
    return {
      isValid: false,
      message: 'No solution exists for this game.',
      newGrid: grid,
    }
  }

  const { result, solution, metadata } = solved

  const { duration, steps } = metadata
  const statistics = `${duration} ms and ${steps} steps`
  const message = `${result ? 'A' : 'No'} solution was found for this game in ${statistics}.`

  return {
    isValid: result,
    message: message,
    newGrid: structuredClone(grid).map((row, i) =>
      row.map((cell, j) => ({
        ...cell,
        highlight: false,
        note: cell.fixed ? cell.value : solution[i][j],
      })),
    ),
  }
}
