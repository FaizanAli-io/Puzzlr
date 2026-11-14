import { Controller } from '@/components/Controller'
import { Header } from '@/components/Header'
import { Selector } from '@/components/Selector'
import { Grid } from './Grid'

import { GameSelector } from '@/utils/gameSelector'
import { useGameState } from '@/utils/useGameState'
import * as gameUtils from '../utils/gameState'

const loadGrid = (index: number) =>
  gameUtils.resetGame(GameSelector.getGame('sudoku', index).grid)

export const Sudoku = () => {
  const { selectedGame, changeGame, grid, setGrid } = useGameState(loadGrid)

  return (
    <>
      <Header title="Sudoku" description="Sudoku player and solver" />
      <Selector
        type="sudoku"
        selectedGame={selectedGame}
        onChange={changeGame}
      />
      <Grid grid={grid} setGrid={setGrid} />
      <Controller grid={grid} setGrid={setGrid} gameUtils={gameUtils} />
    </>
  )
}
