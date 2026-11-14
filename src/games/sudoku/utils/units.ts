import { checkAndReturnGameSize } from '@/utils/helper'

export function getUnits<T>(grid: T[][], boxOf: (cell: T) => number) {
  const gridSize = checkAndReturnGameSize(grid)

  const createUnits = (): T[][] => Array.from({ length: gridSize }, () => [])

  const units = {
    rowT: createUnits(),
    colT: createUnits(),
    boxT: createUnits(),
  }

  grid.forEach((row, i) =>
    row.forEach((cell, j) => {
      units.rowT[i].push(cell)
      units.colT[j].push(cell)
      units.boxT[boxOf(cell)].push(cell)
    }),
  )

  return units
}
