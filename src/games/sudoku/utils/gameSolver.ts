import type { CellState, GridSize } from '../types'

import { checkAndReturnGameSize } from '@/utils/helper'
import { getUnits } from '@/utils/units'

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
    groupT: SolverCell[][]
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

    this.transpositions = getUnits(this.matrix, (cell) => cell.position.k)
  }

  solve() {
    this.steps = 0

    const start = performance.now()

    this.initializePossibleMoves()

    while ([this.findNakedSingles(), this.findHiddenSingles()].some(Boolean));

    return {
      result: this.matrix.every((row) => row.every((cell) => cell.value !== 0)),
      solution: this.matrix.map((row) => row.map(({ value }) => value)),
      metadata: {
        duration: Math.round(performance.now() - start),
        steps: this.steps,
      },
    }
  }

  private findNakedSingles() {
    let nakedSingles = false

    this.matrix.forEach((row) =>
      row.forEach((cell) => {
        if (cell.value === 0 && cell.possibleMoves.size === 0)
          throw Error('Unsolvable Sudoku grid')

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
    const { rowT, colT, groupT } = this.transpositions

    const validMoves = new Set(
      Array.from({ length: this.gridSize }, (_, j) => j + 1),
    )

    this.matrix.flat().forEach((cell) => {
      const { i, j, k } = cell.position

      if (cell.value === 0)
        cell.possibleMoves = validMoves.difference(
          new Set([...rowT[i], ...colT[j], ...groupT[k]].map((c) => c.value)),
        )
    })
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
    const { rowT, colT, groupT } = this.transpositions
    const { value, position } = fixedCell
    const { i, j, k } = position

    rowT[i].forEach((cell) => cell.possibleMoves.delete(value))
    colT[j].forEach((cell) => cell.possibleMoves.delete(value))
    groupT[k].forEach((cell) => cell.possibleMoves.delete(value))

    fixedCell.possibleMoves.clear()
  }
}
