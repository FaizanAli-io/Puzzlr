import { useState } from 'react'

export function useGameState<T>(loadGrid: (index: number) => T) {
  const [selectedGame, setSelectedGame] = useState(0)
  const [grid, setGrid] = useState(() => loadGrid(0))

  const changeGame = (index: number) => {
    setSelectedGame(index)
    setGrid(loadGrid(index))
  }

  return { selectedGame, changeGame, grid, setGrid }
}
