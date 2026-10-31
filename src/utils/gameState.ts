import type {
  Coord,
  GridCell,
  GridCellMatrix,
  GridCellState,
  GridCellStateMatrix,
} from '../types'

export function initializeGameState(grid: GridCellMatrix): GridCellStateMatrix {
  return grid.map((row) =>
    row.map((cell) => ({
      region: cell,
      isClicked: false,
      highlight: false,
    })),
  )
}

export function printGameState(grid: GridCellStateMatrix) {
  return JSON.stringify(
    grid
      .flatMap((row, i) => row.map((cell, j) => cell.isClicked && [i, j]))
      .filter((x) => x),
    null,
    2,
  )
}

export function resetGameState(grid: GridCellStateMatrix): GridCellStateMatrix {
  return grid.map((row) =>
    row.map((cell) => ({ ...cell, isClicked: false, highlight: false })),
  )
}

export function checkGameState(grid: GridCellStateMatrix) {
  const gridSize = grid.length

  if (!gridSize || !grid.every((row) => row.length === gridSize))
    return { isValid: false, message: 'Grid Dimensions are invalid.' }

  const clickedToNum = (cell: GridCellState) => Number(cell.isClicked)

  type Coord = [number, number]

  const getDiagonalNeighbors = (i: number, j: number): [number, number][] => {
    return (
      [
        [i + 1, j + 1],
        [i + 1, j - 1],
        [i - 1, j + 1],
        [i - 1, j - 1],
      ] satisfies Coord[]
    ).filter(([r, c]) => r >= 0 && c >= 0 && r < gridSize && c < gridSize)
  }

  const regions: Partial<Record<GridCell, number>> = {}

  grid.forEach((row) =>
    row.forEach((cell) => {
      regions[cell.region] = (regions[cell.region] ?? 0) + clickedToNum(cell)
    }),
  )

  const regionCheck =
    Object.keys(regions).length === gridSize &&
    Object.values(regions).every((count) => count === 1)

  const rowCheck = grid.every(
    (row) => row.reduce((a, b) => a + clickedToNum(b), 0) === 1,
  )

  const colCheck = grid[0].every(
    (_, i) => grid.reduce((a, b) => a + clickedToNum(b[i]), 0) === 1,
  )

  const diagCheck = grid.every((row, i) =>
    row.every(
      (cell, j) =>
        !(
          cell.isClicked &&
          getDiagonalNeighbors(i, j).some(([x, y]) => grid[x][y].isClicked)
        ),
    ),
  )

  const isValid = regionCheck && rowCheck && colCheck && diagCheck

  const message = isValid
    ? 'Congratulations, you solved the puzzle!'
    : [
        !regionCheck && 'All regions must have exactly one Queen',
        !rowCheck && 'All rows must have exactly one Queen',
        !colCheck && 'All columns must have exactly one Queen',
        !diagCheck && 'No Two Queens can be diagonally adjacent',
      ]
        .filter((x) => x !== false)
        .join('\n')

  return { isValid, message }
}

export function highlightCells(grid: GridCellStateMatrix, solution: Coord[]) {
  const newGrid = structuredClone(grid)
  for (const [i, j] of solution) {
    newGrid[i][j].highlight = true
  }

  return newGrid
}
