import { COLOR_MAP } from '../constants'

import type { Cell, CellState, Coord } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'

type RegionMap = Record<Cell, boolean>

export class GameSolver {
  private readonly gridSize: number
  private readonly matrix: Cell[][]

  private solution: Coord[] = []
  private steps = 0

  constructor(grid: CellState[][]) {
    this.gridSize = checkAndReturnGameSize(grid)

    this.matrix = grid.map((row) => row.map((cell) => cell.region))
  }

  solve() {
    this.solution = []
    this.steps = 0

    const moves = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, (_, i) => i),
    )

    const regions = Object.fromEntries(
      Object.keys(COLOR_MAP).map((key) => [key, true]),
    ) as RegionMap

    const start = performance.now()

    const result = this.solveRecursive(0, moves, regions)

    const duration = Math.round(performance.now() - start)

    return {
      result,
      solution: this.solution,
      metadata: { duration, steps: this.steps },
    }
  }

  private solveRecursive(
    rowIndex: number,
    moves: number[][],
    regions: RegionMap,
  ) {
    if (rowIndex >= this.gridSize) return true

    this.steps++

    for (const move of moves[rowIndex]) {
      const { newMoves, newRegions } = this.reduceMoves(
        [rowIndex, move],
        moves,
        regions,
      )

      if (this.solveRecursive(rowIndex + 1, newMoves, newRegions)) {
        this.solution.push([rowIndex, move])
        return true
      }
    }

    return false
  }

  private reduceMoves([x, y]: Coord, moves: number[][], regions: RegionMap) {
    const newRegions = { ...regions }
    newRegions[this.matrix[x][y]] = false

    const newMoves = moves.map((row, i) =>
      row.filter(
        (j) =>
          i > x &&
          j !== y &&
          newRegions[this.matrix[i][j]] &&
          (i !== x + 1 || Math.abs(j - y) > 1),
      ),
    )

    return { newMoves, newRegions }
  }
}
