import { COLOR_MAP } from '../constants'
import type { Coord, GridCell, GridCellStateMatrix } from '../types'

type RegionMap = Record<GridCell, boolean>

export class GameSolver {
  gridSize: number
  solution: Coord[]
  matrix: GridCell[][]

  constructor(grid: GridCellStateMatrix) {
    this.solution = []
    this.gridSize = grid.length
    this.matrix = grid.map((row) => row.map((cell) => cell.region))
  }

  solve() {
    const moves = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, (_, i) => i),
    )

    const regions = Object.fromEntries(
      Object.keys(COLOR_MAP).map((key) => [key, true]),
    ) as RegionMap

    const result = this.solveRecursive(0, moves, regions)

    return { result, solution: this.solution }
  }

  private solveRecursive(
    rowIndex: number,
    moves: number[][],
    regions: RegionMap,
  ) {
    if (rowIndex >= this.gridSize) return true
    if (moves[rowIndex].length === 0) return false

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
