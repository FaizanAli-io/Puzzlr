import { LINK_SIGNS, NEXT_VALUE, SYMBOLS } from '../constants'

import type { GridCellProps, GridProps, LinkType } from '../types'

import { updateCell } from '../utils/gameState'

const Link = ({ type, className }: { type: LinkType; className: string }) => (
  <span
    className={`pointer-events-none absolute z-10 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-400 bg-white text-xs font-bold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 ${className}`}
  >
    {LINK_SIGNS[type]}
  </span>
)

const GridCell = ({ cell, onClick }: GridCellProps) => {
  const fixedClass = cell.fixed
    ? 'bg-neutral-300 dark:bg-neutral-700'
    : 'bg-neutral-100 dark:bg-neutral-800'
  const conflictClass = cell.conflict ? 'ring-4 ring-red-500 ring-inset' : ''

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className={`flex aspect-square w-full items-center justify-center rounded-sm text-2xl ${fixedClass} ${conflictClass}`}
      >
        {cell.value ? SYMBOLS[cell.value] : ''}
      </button>
      {cell.right && (
        <Link type={cell.right} className="top-1/2 left-[calc(100%+0.25rem)]" />
      )}
      {cell.down && (
        <Link type={cell.down} className="top-[calc(100%+0.25rem)] left-1/2" />
      )}
    </div>
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
              updateCell(prev, i, j, (c) => NEXT_VALUE[c.value]),
            )
          }
        />
      )),
    )}
  </div>
)
