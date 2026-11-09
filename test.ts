type CellState = {
  box: number
  note: number
  value: number
  fixed: boolean
}

type SolverCell = {
  box: number
  value: number
  possibleMoves?: Set<number>[]
}

type MoveSet = {
  rowMoves: Set<number>[]
  colMoves: Set<number>[]
  boxMoves: Set<number>[]
}

type GridSize = 6 | 9

function resetGame(grid: number[][]): CellState[][] {
  const gridSize = checkAndReturnGameSize(grid) as GridSize

  const mapper = {
    6: (i: number, j: number) => Math.floor(j / 3) + Math.floor(i / 2) * 2,
    9: (i: number, j: number) => Math.floor(j / 3) + Math.floor(i / 3) * 3,
  }[gridSize]

  return grid.map((row, i) =>
    row.map((value, j) => {
      return {
        box: mapper(i, j),
        note: 0,
        value: value,
        fixed: value !== 0,
      }
    }),
  )
}

function checkAndReturnGameSize(grid: unknown[][]) {
  const gridSize = grid.length

  if (!gridSize || !grid.every((row) => row.length === gridSize))
    throw RangeError('Invalid grid dimensions')

  return gridSize
}

export class GameSolver {
  gridSize: number
  matrix: SolverCell[][]

  constructor(grid: CellState[][]) {
    this.gridSize = checkAndReturnGameSize(grid)

    this.matrix = grid.map((row) =>
      row.map(({ box, value }) => ({ box, value })),
    )
  }

  solve() {
    const moveSet = this.initializeValidMoves()

    console.log(this.matrix.map((row) => row.map((cell) => cell.value)))

    let modified: boolean

    do {
      modified = false

      this.matrix.forEach((row, i) =>
        row.forEach((cell, j) => {
          if (cell.value === 0) {
            const { rowMoves, colMoves, boxMoves } = moveSet
            const possibleMoves = boxMoves[cell.box]
              .intersection(colMoves[j])
              .intersection(rowMoves[i])

            if (possibleMoves.size === 1) {
              const move = [...possibleMoves][0]
              console.log(`Playing ${move} at ${[i, j]}`)

              cell.value = move
              rowMoves[i].delete(move)
              colMoves[j].delete(move)
              boxMoves[cell.box].delete(move)

              modified = true
            }
          }
        }),
      )
    } while (modified)

    console.log(this.matrix.map((row) => row.map((cell) => cell.value)))
  }

  private initializeValidMoves(): MoveSet {
    const validMoves = Array.from({ length: this.gridSize }, (_, j) => j + 1)

    const createMoveSet = (): Set<number>[] =>
      Array.from({ length: this.gridSize }, () => new Set(validMoves))

    const [rows, cols, boxes] = Array.from({ length: 3 }, createMoveSet)

    this.matrix.forEach((row, i) =>
      row.forEach((cell, j) => {
        const { box, value } = cell

        if (value !== 0) {
          rows[i].delete(value)
          cols[j].delete(value)
          boxes[box].delete(value)
        }
      }),
    )

    return {
      rowMoves: rows,
      colMoves: cols,
      boxMoves: boxes,
    }
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
}

new GameSolver(
  resetGame([
    [0, 0, 0, 2, 0, 0],
    [0, 0, 5, 0, 0, 4],
    [0, 3, 4, 0, 0, 0],
    [0, 5, 0, 0, 4, 2],
    [0, 0, 0, 1, 0, 3],
    [0, 0, 0, 0, 2, 5],
  ]),
).solve()
