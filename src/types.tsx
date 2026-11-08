import type { Dispatch, SetStateAction } from 'react'

export type StateProps<T, K extends string> = {
  [P in K]: T
} & {
  [P in `set${Capitalize<K>}`]: Dispatch<SetStateAction<T>>
}

export type GameOptions = 'queens' | 'sudoku'
