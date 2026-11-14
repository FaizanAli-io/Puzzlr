import { useEffect, type ComponentType } from 'react'

import type { AnyGameSession } from '@/session'
import type { GameOptions, GameUtils, StateProps } from '@/types'

import { Controller } from '@/components/Controller'
import { Header } from '@/components/Header'
import { ImportGame } from '@/components/ImportGame'
import { Selector } from '@/components/Selector'

import { updateSession } from '@/session'
import { useGameState } from '@/utils/useGameState'

type GamePageProps<T> = {
  type: GameOptions
  title: string
  schema: object
  Grid: ComponentType<StateProps<T, 'grid'>>
  gameUtils: GameUtils<T>
  loadGrid: (index: number) => T
}

export const GamePage = <T,>({
  type,
  title,
  schema,
  Grid,
  gameUtils,
  loadGrid,
}: GamePageProps<T>) => {
  const game = useGameState(loadGrid, gameUtils)

  // The session union is keyed by game type, which this generic page can't
  // express, so the link between `type` and the grid type is asserted here.
  useEffect(() => {
    updateSession({
      game: {
        ...game,
        type,
        schema,
        parseGame: gameUtils.parseGame,
      } as unknown as AnyGameSession,
    })
  })

  useEffect(() => () => updateSession({ game: undefined }), [])

  return (
    <>
      <Header title={title} description={`${title} player and solver`} />
      <Selector
        type={type}
        selectedGame={game.selectedGame}
        onChange={game.changeGame}
      />
      <Grid grid={game.grid} setGrid={game.setGrid} />
      <Controller
        result={game.result}
        actions={game.actions}
        onClear={game.clearResult}
      />
      <ImportGame parse={gameUtils.parseGame} onImport={game.importGame} />
    </>
  )
}
