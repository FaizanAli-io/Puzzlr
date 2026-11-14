import { COLOR_MAP } from '../constants'

import type { GridCellProps, GridProps } from '../types'

const GridCell = ({ cell, onClick }: GridCellProps) => {
  const borderClass = cell.highlight
    ? 'border-4 border-neutral-900 dark:border-white'
    : ''
  const conflictClass = cell.conflict ? 'ring-4 ring-red-500 ring-inset' : ''

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: COLOR_MAP[cell.region] }}
      className={`flex aspect-square items-center justify-center rounded-sm text-xl text-neutral-900 dark:brightness-90 ${borderClass} ${conflictClass}`}
    >
      {cell.isClicked ? 'X' : ''}
    </button>
  )
}

export const Grid = ({ grid, setGrid }: GridProps) => {
  const gridSize = grid.length

  const cellClicked = (i: number, j: number) => {
    setGrid((prev) =>
      prev.map((row, r) =>
        row.map((cell, c) =>
          r === i && c === j
            ? { ...cell, isClicked: !cell.isClicked, conflict: false }
            : { ...cell, conflict: false },
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
