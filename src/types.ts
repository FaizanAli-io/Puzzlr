import type { Dispatch, SetStateAction } from 'react'

import { COLOR_MAP } from './constants'

export type Coord = [number, number]

export type GridCell = keyof typeof COLOR_MAP

export type GridCellMatrix = GridCell[][]

export type GameListItem = {
  id: number
  size: number
}

export type Game = {
  id: number
  size: number
  regions: GridCellMatrix
}

export type GridCellState = {
  region: GridCell
  isClicked: boolean
  highlight: boolean
}

export type GridCellStateMatrix = GridCellState[][]

export type GridCellProps = {
  cell: GridCellState
  onClick: () => void
}

export type GameGridProps = {
  grid: GridCellStateMatrix
  setGrid: Dispatch<SetStateAction<GridCellStateMatrix>>
  gridSize: number
}

export type GameOptionsProps = Pick<GameGridProps, 'grid' | 'setGrid'>
