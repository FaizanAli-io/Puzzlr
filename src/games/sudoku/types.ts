import type { StateProps } from '@/types'

export type GridSize = 6 | 9

export type Game = {
  id: number
  size: GridSize
  grid: number[][]
}

export type CellState = {
  region: number
  value: number
  fixed: boolean
}

export type GridCellProps = {
  cell: CellState
  onClick: () => void
}

export type GridProps = StateProps<CellState[][], 'grid'> & {
  gridSize: GridSize
}
