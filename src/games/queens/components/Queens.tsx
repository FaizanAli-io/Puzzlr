import { useState } from 'react'

import { Header } from '@/components/Header'
import { GameGrid } from './GameGrid'
import { GameOptions } from './GameOptions'
import { GameSelector } from './GameSelector'

import { getGame } from '../utils/games'
import { initializeGameState } from '../utils/gameState'

export const Queens = () => {
  const [selectedGame, setSelectedGame] = useState(0)

  const current = getGame(selectedGame)

  const [gridSize, setGridSize] = useState(() => current.size)

  const [grid, setGrid] = useState(() => initializeGameState(current.regions))

  const changeGame = (index: number) => {
    const current = getGame(index)

    setSelectedGame(index)
    setGridSize(current.size)
    setGrid(initializeGameState(current.regions))
  }

  return (
    <>
      <Header title="Queens" description="Queens player and solver" />
      <GameSelector selectedGame={selectedGame} onChange={changeGame} />
      <GameGrid
        key={selectedGame}
        grid={grid}
        setGrid={setGrid}
        gridSize={gridSize}
      />
      <GameOptions grid={grid} setGrid={setGrid} />
    </>
  )
}
