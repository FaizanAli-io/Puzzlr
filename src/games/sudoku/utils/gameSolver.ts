import type { CellState, GridSize } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'

type SolverCell = {
  value: number
  possibleMoves: Set<number>
  position: { i: number; j: number; k: number }
}

export class GameSolver {
  private readonly gridSize: GridSize
  private readonly matrix: SolverCell[][]
  private readonly transpositions: {
    rowT: SolverCell[][]
    colT: SolverCell[][]
    boxT: SolverCell[][]
  }

  private steps = 0

  constructor(grid: CellState[][]) {
    const gridSize = checkAndReturnGameSize(grid)

    if (gridSize !== 6 && gridSize !== 9)
      throw new RangeError('Unsupported grid size')

    this.gridSize = gridSize

    this.matrix = grid.map((row, i) =>
      row.map(({ box, value, fixed }, j) => ({
        value: fixed ? value : 0,
        possibleMoves: new Set(),
        position: { i, j, k: box },
      })),
    )

    this.transpositions = {
      rowT: Array.from({ length: this.gridSize }, () => []),
      colT: Array.from({ length: this.gridSize }, () => []),
      boxT: Array.from({ length: this.gridSize }, () => []),
    }

    this.matrix.forEach((row) =>
      row.forEach((cell) => {
        const { i, j, k } = cell.position
        this.transpositions.rowT[i].push(cell)
        this.transpositions.colT[j].push(cell)
        this.transpositions.boxT[k].push(cell)
      }),
    )
  }

  solve() {
    let nakedSingles: boolean
    let hiddenSingles: boolean

    this.steps = 0

    const start = performance.now()

    this.initializePossibleMoves()

    do {
      nakedSingles = this.findNakedSingles()
      hiddenSingles = this.findHiddenSingles()
    } while (nakedSingles || hiddenSingles)

    const duration = Math.round(performance.now() - start)

    return this.deconstruct(duration)
  }

  private deconstruct(duration: number) {
    return {
      result: !this.matrix.some((row) => row.some((cell) => cell.value === 0)),
      solution: this.matrix.map((row) => row.map(({ value }) => value)),
      metadata: { duration, steps: this.steps },
    }
  }

  private findNakedSingles() {
    let nakedSingles = false

    this.matrix.forEach((row) =>
      row.forEach((cell) => {
        if (cell.possibleMoves.size === 1) {
          this.setValue(cell, cell.possibleMoves)
          nakedSingles = true
        }
      }),
    )

    return nakedSingles
  }

  private findHiddenSingles() {
    let hiddenSingles = false

    for (const moveSetType of Object.values(this.transpositions))
      for (let x = 0; x < this.gridSize; x++)
        this.getUniqueElements(
          moveSetType[x].map((cell) => cell.possibleMoves),
        ).forEach((moveSet, i) => {
          if (moveSet.size === 1) {
            this.setValue(moveSetType[x][i], moveSet)
            hiddenSingles = true
          }
        })

    return hiddenSingles
  }

  private initializePossibleMoves() {
    const validMoves = Array.from({ length: this.gridSize }, (_, j) => j + 1)

    const createMoveSet = (): Set<number>[] =>
      Array.from({ length: this.gridSize }, () => new Set(validMoves))

    const [rowMoves, colMoves, boxMoves] = Array.from(
      { length: 3 },
      createMoveSet,
    )

    this.matrix.forEach((row) =>
      row.forEach((cell) => {
        const { value, position } = cell
        const { i, j, k } = position

        if (value !== 0) {
          rowMoves[i].delete(value)
          colMoves[j].delete(value)
          boxMoves[k].delete(value)
        }
      }),
    )

    this.matrix.forEach((row) =>
      row.forEach((cell) => {
        const { value, position } = cell
        const { i, j, k } = position

        if (value === 0)
          cell.possibleMoves = rowMoves[i]
            .intersection(colMoves[j])
            .intersection(boxMoves[k])
      }),
    )
  }

  private getUniqueElements(sets: Set<number>[]): Set<number>[] {
    return sets.map((set, i) =>
      set.difference(
        sets
          .filter((_, j) => i !== j)
          .reduce((acc, s) => acc.union(s), new Set<number>()),
      ),
    )
  }

  private setValue(cell: SolverCell, move: Set<number>) {
    const extractedMove = move.values().next().value!

    if (cell.value !== 0 || !cell.possibleMoves.has(extractedMove))
      throw new Error('Invalid Move')

    this.steps++

    cell.value = extractedMove
    this.propagate(cell)
  }

  private propagate(fixedCell: SolverCell) {
    const { rowT, colT, boxT } = this.transpositions
    const { value, position } = fixedCell
    const { i, j, k } = position

    rowT[i].forEach((cell) => cell.possibleMoves.delete(value))
    colT[j].forEach((cell) => cell.possibleMoves.delete(value))
    boxT[k].forEach((cell) => cell.possibleMoves.delete(value))

    fixedCell.possibleMoves.clear()
  }
}
