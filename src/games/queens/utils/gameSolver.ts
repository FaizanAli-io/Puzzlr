import type { Cell, CellState, Coord } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'

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

    const start = performance.now()

    const result = this.solveRecursive(0, moves, new Set())

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
    usedRegions: Set<Cell>,
  ) {
    if (rowIndex >= this.gridSize) return true

    this.steps++

    for (const move of moves[rowIndex]) {
      const { newMoves, newUsedRegions } = this.reduceMoves(
        [rowIndex, move],
        moves,
        usedRegions,
      )

      if (this.shouldSkipBranch(newMoves, rowIndex)) continue

      if (this.solveRecursive(rowIndex + 1, newMoves, newUsedRegions)) {
        this.solution.push([rowIndex, move])
        return true
      }
    }

    return false
  }

  private reduceMoves(
    [x, y]: Coord,
    moves: number[][],
    usedRegions: Set<Cell>,
  ) {
    const newUsedRegions = new Set(usedRegions).add(this.matrix[x][y])

    const newMoves = moves.map((row, i) =>
      row.filter(
        (j) =>
          i > x &&
          j !== y &&
          !newUsedRegions.has(this.matrix[i][j]) &&
          (i !== x + 1 || Math.abs(j - y) > 1),
      ),
    )

    return { newMoves, newUsedRegions }
  }

  private shouldSkipBranch(newMoves: number[][], x: number) {
    const remaining = this.gridSize - x - 1

    const reachableCols = new Set(newMoves.flat())
    const reachableRegions = new Set(
      newMoves.flatMap((row, i) => row.map((j) => this.matrix[i][j])),
    )

    return (
      newMoves.some((row, i) => i > x && row.length === 0) ||
      reachableCols.size < remaining ||
      reachableRegions.size < remaining
    )
  }
}
