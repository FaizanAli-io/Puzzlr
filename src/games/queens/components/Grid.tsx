import { COLOR_MAP } from '../constants'

import type { GridCellProps, GridProps } from '../types'

import { toggleQueen } from '../utils/gameState'

const GridCell = ({ cell, onClick }: GridCellProps) => {
  const conflictClass = cell.conflict ? 'ring-4 ring-red-500 ring-inset' : ''

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: COLOR_MAP[cell.region] }}
      className={`flex aspect-square items-center justify-center rounded-sm text-xl text-neutral-900 dark:brightness-90 ${conflictClass}`}
    >
      {cell.isClicked ? 'X' : ''}
    </button>
  )
}

export const Grid = ({ grid, setGrid }: GridProps) => (
  <div
    className="grid gap-2"
    style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
  >
    {grid.map((row, i) =>
      row.map((cell, j) => (
        <GridCell
          key={`${i}-${j}`}
          cell={cell}
          onClick={() => setGrid((prev) => toggleQueen(prev, i, j))}
        />
      )),
    )}
  </div>
)
