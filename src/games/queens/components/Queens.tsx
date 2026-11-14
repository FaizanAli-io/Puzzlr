import { Controller } from '@/components/Controller'
import { Header } from '@/components/Header'
import { Selector } from '@/components/Selector'
import { Grid } from './Grid'

import { GameSelector } from '@/utils/gameSelector'
import { useGameState } from '@/utils/useGameState'
import * as gameUtils from '../utils/gameState'

const loadGrid = (index: number) =>
  gameUtils.resetGame(GameSelector.getGame('queens', index).regions)

export const Queens = () => {
  const { selectedGame, changeGame, grid, setGrid } = useGameState(loadGrid)

  return (
    <>
      <Header title="Queens" description="Queens player and solver" />
      <Selector
        type="queens"
        selectedGame={selectedGame}
        onChange={changeGame}
      />
      <Grid grid={grid} setGrid={setGrid} />
      <Controller grid={grid} setGrid={setGrid} gameUtils={gameUtils} />
    </>
  )
}
