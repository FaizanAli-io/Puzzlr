import games from '../games.json'

import type { Game, GameListItem } from '../types'

export function getGame(index: number): Game {
  return games[index] as Game
}

export function getGameList(): GameListItem[] {
  return games as GameListItem[]
}
