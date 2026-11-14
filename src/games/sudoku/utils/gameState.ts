import type { CellState, GridSize } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'
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

  const rowConflicts = findConflicts(rowT)
  const colConflicts = findConflicts(colT)
  const boxConflicts = findConflicts(groupT)

  const conflicts = new Set([...rowConflicts, ...colConflicts, ...boxConflicts])

  const emptyCells = grid.flat().filter((cell) => cell.value === 0).length

  const newGrid = grid.map((row) =>
    row.map((cell) => ({ ...cell, highlight: conflicts.has(cell) })),
  )

  if (conflicts.size > 0)
    return {
      isValid: false,
      message: [
        rowConflicts.length > 0 && 'Rows cannot contain repeated numbers',
        colConflicts.length > 0 && 'Columns cannot contain repeated numbers',
        boxConflicts.length > 0 && 'Boxes cannot contain repeated numbers',
      ]
        .filter((x) => x !== false)
        .join('\n'),
      newGrid,
    }

  if (emptyCells > 0)
    return {
      isValid: undefined,
      message: `No conflicts so far, ${emptyCells} cells left.`,
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
