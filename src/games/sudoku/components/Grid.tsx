import { COLOR_MAP } from '../constants'

import type { CellState, GridCellProps, GridProps } from '../types'

import { updateCell } from '../utils/gameState'

const getStyleAndValue = ({ fixed, value }: CellState) => ({
  style: fixed ? 'font-bold text-neutral-900' : 'font-normal text-neutral-900',
  value: value || '',
})

const GridCell = ({ cell, onClick }: GridCellProps) => {
  const { style, value } = getStyleAndValue(cell)
  const conflictClass = cell.conflict ? 'ring-4 ring-red-500 ring-inset' : ''

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: COLOR_MAP[cell.box] }}
      className={`flex aspect-square items-center justify-center rounded-sm text-xl dark:brightness-90 ${style} ${conflictClass}`}
    >
      {value}
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
          onClick={() =>
            setGrid((prev) =>
              updateCell(prev, i, j, (c) => (c.value + 1) % (prev.length + 1)),
            )
          }
        />
      )),
    )}
  </div>
)
