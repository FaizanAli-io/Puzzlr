import type { CellState, GridSize } from '../types'

import {
  checkAndReturnGameSize,
  getCheckResult,
  parseGrid,
} from '@/utils/helper'
import { getUnits } from '@/utils/units'

import schema from '../schema.json'
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
        box: mapper(i, j),
        conflict: false,
      }
    }),
  )
}

export const updateCell = (
  grid: CellState[][],
  i: number,
  j: number,
  getValue: (cell: CellState) => number,
) =>
  grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      conflict: false,
      value: !cell.fixed && r === i && c === j ? getValue(cell) : cell.value,
    })),
  )

export function parseGame(input: unknown) {
  const rows = parseGrid(
    input,
    'grid',
    schema.properties.grid.oneOf.map(({ minItems }) => minItems),
  )

  rows.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (
        !Number.isInteger(cell) ||
        (cell as number) < 0 ||
        (cell as number) > rows.length
      )
        throw new Error(
          `Row ${i + 1}, column ${j + 1}: expected a whole number from 0 to ${rows.length}, found ${JSON.stringify(cell)}`,
        )
    }),
  )

  const grid = resetGame(rows as number[][])
  const { isValid, message } = checkGame(grid)

  if (isValid === false) throw new Error(`Given numbers conflict:\n${message}`)

  return grid
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
      row.map((cell) => ({ ...cell, conflict: conflicts.has(cell) })),
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
    newGrid: result
      ? grid.map((row, i) =>
          row.map((cell, j) => ({
            ...cell,
            conflict: false,
            value: solution[i][j],
          })),
        )
      : grid,
  }
}
