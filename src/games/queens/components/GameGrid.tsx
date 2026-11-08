import { COLOR_MAP } from '../constants'

import type { GameGridProps, GridCellProps } from '../types'

const GridCell = ({ cell, onClick }: GridCellProps) => {
  const borderClass = cell.highlight ? 'border-4' : ''

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: COLOR_MAP[cell.region] }}
      className={`flex aspect-square items-center justify-center rounded-sm ${borderClass}`}
    >
      {cell.isClicked ? 'X' : ''}
    </button>
  )
}

export const GameGrid = ({ grid, setGrid, gridSize }: GameGridProps) => {
  const cellClicked = (i: number, j: number) => {
    setGrid((prev) =>
      prev.map((row, r) =>
        row.map((item, c) =>
          r === i && c === j ? { ...item, isClicked: !item.isClicked } : item,
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
