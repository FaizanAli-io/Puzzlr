import type { CellState } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'

type MoveSet = {
  rowMoves: number[][]
  colMoves: number[][]
  boxMoves: number[][]
}

export class GameSolver {
  gridSize: number
  matrix: CellState[][]

  constructor(grid: CellState[][]) {
    this.gridSize = checkAndReturnGameSize(grid)
    this.matrix = structuredClone(grid)
  }

  solve() {
    const moves = this.initializeValidMoves()
  }

  private initializeValidMoves(): MoveSet {
    const moves = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, (_, j) => j + 1),
    )

    return {
      rowMoves: moves,
      colMoves: structuredClone(moves),
      boxMoves: structuredClone(moves),
    }
  }

  private updateValidMoves(moveSet: MoveSet) {
    const newMoveSet = structuredClone(moveSet)

    newMoveSet.rowMoves = moveSet.rowMoves
  }

  private getValue(cell: CellState) {
    return cell.fixed ? cell.value : cell.note
  }
}
