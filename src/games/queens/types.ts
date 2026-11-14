import type { StateProps } from '@/types'

import { COLOR_MAP } from './constants'

export type Coord = [number, number]

export type Cell = keyof typeof COLOR_MAP

export type Game = {
  id: number
  size: number
  regions: Cell[][]
}

export type CellState = {
  region: Cell
  isClicked: boolean
  highlight: boolean
}

export type GridCellProps = {
  cell: CellState
  onClick: () => void
}

export type GridProps = StateProps<CellState[][], 'grid'>
