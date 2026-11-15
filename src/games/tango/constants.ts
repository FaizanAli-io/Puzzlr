import type { LinkType, Value } from './types'

export const GRID_SIZE = 6

export const SYMBOLS: Record<Exclude<Value, 0>, string> = {
  1: '☀️',
  2: '🌙',
}

export const LINK_SIGNS: Record<LinkType, string> = {
  equal: '=',
  opposite: 'x',
}

// Empty -> sun -> moon -> empty.
export const NEXT_VALUE: Record<Value, Value> = { 0: 1, 1: 2, 2: 0 }
