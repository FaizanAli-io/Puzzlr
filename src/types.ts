import type { Dispatch, SetStateAction } from 'react'

import { COLOR_MAP } from './constants'

export type Coord = [number, number]

export type GameListItem = {
  index: number
  name: string
  size: number
}

export type GridCell = keyof typeof COLOR_MAP

export type GridCellState = {
  region: GridCell
  isClicked: boolean
  highlight: boolean
}

export type GridCellMatrix = GridCell[][]

export type GridCellStateMatrix = GridCellState[][]

export type Game = {
  id: number
  name: string
  size: number
  regions: GridCellMatrix
  solutions: number[][]
}

export type GridCellProps = {
  cell: GridCellState
  onClick: () => void
}

export type GameGridProps = {
  grid: GridCellStateMatrix
  setGrid: Dispatch<SetStateAction<GridCellStateMatrix>>
}

export type GameOptionsProps = GameGridProps
