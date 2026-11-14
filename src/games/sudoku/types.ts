import type { StateProps } from '@/types'

export type GridSize = 6 | 9

export type Game = {
  id: number
  size: GridSize
  grid: number[][]
}

export type CellState = {
  box: number
  note: number
  value: number
  fixed: boolean
  highlight: boolean
}

export type GridCellProps = {
  cell: CellState
  onClick: () => void
}

export type GridProps = StateProps<CellState[][], 'grid'>
