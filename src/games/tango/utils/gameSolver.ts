import type { CellState, Coord, LinkType, Value } from '../types'

import { getGame } from '@/utils/gameSelector'
import { checkAndReturnGameSize } from '@/utils/helper'

import { loadGame } from './gameState'

type SolverCell = Pick<CellState, 'value' | 'fixed'>

const flip = (v: Value): Value => (3 - v) as Value

export class GameSolver {
  private readonly grid: SolverCell[][]
  private readonly rules: [Coord, Coord, LinkType][]

  constructor(grid: CellState[][]) {
    checkAndReturnGameSize(grid)

    this.rules = []

    this.grid = grid.map((row) =>
      row.map(({ value, fixed }) => ({ value, fixed })),
    )

    grid.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (cell.right) this.rules.push([[i, j], [i, j + 1], cell.right])
        if (cell.down) this.rules.push([[i, j], [i + 1, j], cell.down])
      }),
    )

    console.log(this.rules)
  }

  solve() {}

  solveDeterministic(grid: SolverCell[][]) {
    const newGrid = structuredClone(grid)

    this.applyRules(newGrid)
  }

  applyRules(grid: SolverCell[][]) {
    this.rules.forEach(([[x1, y1], [x2, y2], type]) => {
      const a = grid[x1][y1]
      const b = grid[x2][y2]

      if (a.value !== 0 && b.value === 0) {
        if (type === 'equal') b.value = a.value
        else b.value = flip(a.value)
      }

      if (a.value === 0 && b.value !== 0) {
        if (type === 'equal') a.value = b.value
        else a.value = flip(b.value)
      }
    })
  }
}

new GameSolver(loadGame(getGame('tango', 0)))
