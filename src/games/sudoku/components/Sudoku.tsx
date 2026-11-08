import { useState } from 'react'

import { Controller } from '@/components/Controller'
import { Header } from '@/components/Header'
import { Selector } from '@/components/Selector'
import { Grid } from './Grid'

import { GameSelector } from '@/utils/gameSelector'
import * as gameUtils from '../utils/gameState'

export const Sudoku = () => {
  const [selectedGame, setSelectedGame] = useState(0)

  const current = GameSelector.getGame('sudoku', selectedGame)

  const [gridSize, setGridSize] = useState(() => current.size)

  const [grid, setGrid] = useState(() => gameUtils.resetGame(current.grid))

  const changeGame = (index: number) => {
    const current = GameSelector.getGame('sudoku', index)

    setSelectedGame(index)
    setGridSize(current.size)
    setGrid(gameUtils.resetGame(current.grid))
  }

  return (
    <>
      <Header title="Sudoku" description="Sudoku player and solver" />
      <Selector
        type="sudoku"
        selectedGame={selectedGame}
        onChange={changeGame}
      />
      <Grid
        key={selectedGame}
        grid={grid}
        setGrid={setGrid}
        gridSize={gridSize}
      />
      <Controller grid={grid} setGrid={setGrid} gameUtils={gameUtils} />
    </>
  )
}
