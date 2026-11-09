import { COLOR_MAP } from '../constants'

import type { GridCellProps, GridProps } from '../types'

const GridCell = ({ cell, onClick }: GridCellProps) => {
  const weightClass = cell.fixed ? 'font-bold' : ''

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: COLOR_MAP[cell.box] }}
      className={`flex aspect-square items-center justify-center rounded-sm text-xl ${weightClass}`}
    >
      {cell.value || ''}
    </button>
  )
}

export const Grid = ({ grid, setGrid, gridSize }: GridProps) => {
  const cellClicked = (i: number, j: number) => {
    setGrid((prev) =>
      prev.map((row, r) =>
        row.map((cell, c) =>
          !cell.fixed && r === i && c === j
            ? { ...cell, value: (cell.value + 1) % (gridSize + 1) }
            : cell,
        ),
      ),
    )
  }

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <GridCell
            key={`${i}-${j}`}
            cell={cell}
            onClick={() => cellClicked(i, j)}
          />
        )),
      )}
    </div>
  )
}
