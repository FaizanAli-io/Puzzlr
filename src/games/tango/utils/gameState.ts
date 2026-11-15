import type { CellState, Constraint, Game, LinkType, Value } from '../types'

import {
  checkAndReturnGameSize,
  getCheckResult,
  parseGrid,
} from '@/utils/helper'
import { getUnits } from '@/utils/units'
import { GRID_SIZE } from '../constants'
import schema from '../schema.json'
import { GameSolver } from '../utils/gameSolver'

export function loadGame({
  grid,
  constraints,
}: Pick<Game, 'grid' | 'constraints'>): CellState[][] {
  const cells: CellState[][] = grid.map((row) =>
    row.map((value) => ({ value, fixed: value !== 0, conflict: false })),
  )

  constraints.forEach(({ cells: [[r1, c1], [r2, c2]], type }) => {
    cells[Math.min(r1, r2)][Math.min(c1, c2)][r1 === r2 ? 'right' : 'down'] =
      type
  })

  return cells
}

export const resetGame = (grid: CellState[][]): CellState[][] =>
  grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      value: cell.fixed ? cell.value : 0,
      conflict: false,
    })),
  )

export const updateCell = (
  grid: CellState[][],
  i: number,
  j: number,
  getValue: (cell: CellState) => Value,
) =>
  grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      conflict: false,
      value: !cell.fixed && r === i && c === j ? getValue(cell) : cell.value,
    })),
  )

export function parseGame(input: unknown) {
  const rows = parseGrid(input, 'grid', [GRID_SIZE])
  const size = rows.length

  rows.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (
        !Number.isInteger(cell) ||
        (cell as number) < 0 ||
        (cell as number) > 2
      )
        throw new Error(
          `Row ${i + 1}, column ${j + 1}: expected 0 (empty), 1 (sun) or 2 (moon), found ${JSON.stringify(cell)}`,
        )
    }),
  )

  const list = (input as { constraints?: unknown }).constraints ?? []

  if (!Array.isArray(list)) throw new Error('"constraints" must be an array')

  const types: string[] =
    schema.properties.constraints.items.properties.type.enum
  const seen = new Set<string>()

  const constraints = list.map((item, k): Constraint => {
    const { cells, type } = (item ?? {}) as { cells?: unknown; type?: unknown }
    const label = `Constraint ${k + 1}`

    const isCoord = (cell: unknown) =>
      Array.isArray(cell) &&
      cell.length === 2 &&
      cell.every((n) => Number.isInteger(n) && n >= 0 && n < size)

    if (!Array.isArray(cells) || cells.length !== 2 || !cells.every(isCoord))
      throw new Error(
        `${label}: "cells" must be two [row, column] pairs inside the ${size}x${size} board`,
      )

    if (typeof type !== 'string' || !types.includes(type))
      throw new Error(
        `${label}: "type" must be ${types.map((t) => `"${t}"`).join(' or ')}`,
      )

    const [[r1, c1], [r2, c2]] = cells as Constraint['cells']

    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1)
      throw new Error(`${label}: cells must be orthogonally adjacent`)

    const key = `${Math.min(r1, r2)},${Math.min(c1, c2)},${r1 === r2}`

    if (seen.has(key)) throw new Error(`${label}: this pair is already linked`)

    seen.add(key)

    return { cells: cells as Constraint['cells'], type: type as LinkType }
  })

  const grid = loadGame({ grid: rows as Value[][], constraints })
  const { isValid, message } = checkGame(grid)

  if (isValid === false) throw new Error(`Given symbols conflict:\n${message}`)

  return grid
}

export function printGame(grid: CellState[][]) {
  return JSON.stringify(
    grid.map((row) => row.map((cell) => cell.value)),
    null,
    2,
  )
}

export function checkGame(grid: CellState[][]) {
  const gridSize = checkAndReturnGameSize(grid)
  const half = gridSize / 2

  // Only rows and columns matter here, so every cell goes in one spare group.
  const { rowT, colT } = getUnits(grid, () => 0)
  const lines = [...rowT, ...colT]

  const findImbalance = (units: CellState[][]) =>
    units.flatMap((unit) =>
      ([1, 2] as const).flatMap((value) => {
        const same = unit.filter((cell) => cell.value === value)
        return same.length > half ? same : []
      }),
    )

  const findTriples = (units: CellState[][]) =>
    units.flatMap((unit) =>
      unit.flatMap((cell, k) => {
        const trio = unit.slice(k - 2, k + 1)

        return k >= 2 && cell.value && trio.every((c) => c.value === cell.value)
          ? trio
          : []
      }),
    )

  const findBrokenLinks = () =>
    grid.flatMap((row, i) =>
      row.flatMap((cell, j) => {
        const links: [LinkType | undefined, CellState | undefined][] = [
          [cell.right, row[j + 1]],
          [cell.down, grid[i + 1]?.[j]],
        ]

        return links.flatMap(([type, other]) =>
          type &&
          other &&
          cell.value &&
          other.value &&
          (type === 'equal') !== (cell.value === other.value)
            ? [cell, other]
            : [],
        )
      }),
    )

  const emptyCells = grid.flat().filter((cell) => !cell.value).length

  const { conflicts, ...result } = getCheckResult(
    [
      [
        findImbalance(lines),
        `Rows and columns cannot contain more than ${half} suns or moons`,
      ],
      [
        findTriples(lines),
        'No more than two suns or moons can be next to each other in a row or column',
      ],
      [
        findBrokenLinks(),
        'Cells joined by = must match and cells joined by × must differ',
      ],
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
  const { result, solution, metadata } = new GameSolver(grid).solve()

  const { duration, steps } = metadata
  const statistics = `${duration} ms after ${steps} steps`
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
