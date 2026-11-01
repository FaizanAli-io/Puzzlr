import { useState } from 'react'

import { GameGrid } from './GameGrid'
import { GameOptions } from './GameOptions'
import { GameSelector } from './GameSelector'
import { Header } from './Header'

import { getGame } from '../utils/games'
import { initializeGameState } from '../utils/gameState'

export const PageWrapper = () => {
  const [selectedGame, setSelectedGame] = useState(0)

  const current = getGame(selectedGame)

  const [gridSize, setGridSize] = useState(() => current.size)

  const [grid, setGrid] = useState(() => initializeGameState(current.regions))

  const changeGame = (index: number) => {
    const current = getGame(index)

    console.log(current)

    setSelectedGame(index)
    setGridSize(current.size)
    setGrid(initializeGameState(current.regions))
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col items-stretch gap-8 pb-4">
      <Header />
      <GameSelector selectedGame={selectedGame} onChange={changeGame} />
      <GameGrid
        key={selectedGame}
        grid={grid}
        setGrid={setGrid}
        gridSize={gridSize}
      />
      <GameOptions grid={grid} setGrid={setGrid} />
    </main>
  )
}
