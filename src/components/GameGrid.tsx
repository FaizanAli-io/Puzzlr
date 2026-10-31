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

export const GameGrid = ({ grid, setGrid }: GameGridProps) => {
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
    <div className="grid grid-cols-8 gap-2">
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <GridCell
            cell={cell}
            onClick={() => cellClicked(i, j)}
            key={`${i}-${j}`}
          />
        )),
      )}
    </div>
  )
}
