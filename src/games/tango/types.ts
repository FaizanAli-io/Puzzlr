import type { StateProps } from '@/types'

export type Coord = [number, number]

export type Value = 0 | 1 | 2

export type LinkType = 'equal' | 'opposite'

export type Constraint = {
  cells: [Coord, Coord]
  type: LinkType
}

export type Game = {
  id: number
  grid: Value[][]
  constraints: Constraint[]
}

// A constraint is stored on the upper or left cell of the pair it joins.
export type CellState = {
  value: Value
  fixed: boolean
  conflict: boolean
  right?: LinkType
  down?: LinkType
}

export type GridCellProps = {
  cell: CellState
  onClick: () => void
}

export type GridProps = StateProps<CellState[][], 'grid'>
