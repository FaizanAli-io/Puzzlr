import type { Cell, CellState, Coord } from '../types'

import {
  checkAndReturnGameSize,
  getCheckResult,
  parseGrid,
} from '@/utils/helper'
import { getUnits } from '@/utils/units'
import schema from '../schema.json'
import { GameSolver } from '../utils/gameSolver'

export function resetGame(grid: Cell[][] | CellState[][]): CellState[][] {
  return grid.map((row) =>
    row.map((cell) => ({
      region: typeof cell === 'string' ? cell : cell.region,
      isClicked: false,
      conflict: false,
    })),
  )
}

export const toggleQueen = (grid: CellState[][], i: number, j: number) =>
  grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      conflict: false,
      isClicked: r === i && c === j ? !cell.isClicked : cell.isClicked,
    })),
  )

export const placeQueens = (grid: CellState[][], queens: Coord[]) =>
  grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      conflict: false,
      isClicked: queens.some(([i, j]) => i === r && j === c),
    })),
  )

export function parseGame(input: unknown) {
  const { minItems, maxItems, items } = schema.properties.regions
  const letters: string[] = items.items.enum

  const regions = parseGrid(
    input,
    'regions',
    Array.from({ length: maxItems - minItems + 1 }, (_, i) => minItems + i),
  )

  regions.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (typeof cell !== 'string' || !letters.includes(cell))
        throw new Error(
          `Row ${i + 1}, column ${j + 1}: expected a region letter (${letters[0]}-${letters.at(-1)}), found ${JSON.stringify(cell)}`,
        )
    }),
  )

  const count = new Set(regions.flat()).size

  if (count !== regions.length)
    throw new Error(
      `A ${regions.length}x${regions.length} board needs exactly ${regions.length} regions, found ${count}`,
    )

  return resetGame(regions as Cell[][])
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
    newGrid: result ? placeQueens(grid, solution) : grid,
  }
}
