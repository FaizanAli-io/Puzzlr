import { useState } from 'react'

import type { GameActions, GameResult, GameUtils } from '@/types'

// selectedGame is -1 while an imported custom game is loaded.
export function useGameState<T>(
  loadGrid: (index: number) => T,
  gameUtils: GameUtils<T>,
) {
  const [selectedGame, setSelectedGame] = useState(0)
  const [grid, setGrid] = useState(() => loadGrid(0))
  const [result, setResult] = useState<GameResult>()

  const load = (index: number, next: T) => {
    setSelectedGame(index)
    setGrid(next)
    setResult(undefined)
  }

  const show = ({ newGrid, ...shown }: GameResult & { newGrid?: T }) => {
    setResult(shown)
    if (newGrid) setGrid(newGrid)

    return shown.message
  }

  const actions: GameActions = {
    reset: () => {
      load(selectedGame, gameUtils.resetGame(grid))

      return 'Board reset to the starting puzzle.'
    },
    print: () =>
      show({ isValid: undefined, message: gameUtils.printGame(grid) }),
    check: () => show(gameUtils.checkGame(grid)),
    solve: () => show(gameUtils.solveGame(grid)),
  }

  return {
    selectedGame,
    changeGame: (index: number) => load(index, loadGrid(index)),
    importGame: (imported: T) => load(-1, imported),
    grid,
    setGrid,
    result,
    clearResult: () => setResult(undefined),
    actions,
  }
}
