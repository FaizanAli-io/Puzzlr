import { useState } from 'react'

import type { GameOptions } from '@/types'

import { Queens } from '@/games/queens/components/Queens'
import { Sudoku } from '@/games/sudoku/components/Sudoku'
import { GameMenu } from './GameMenu'

const GameMap = {
  queens: Queens,
  sudoku: Sudoku,
}

export const PageWrapper = () => {
  const [selectedGame, setSelectedGame] = useState<GameOptions>()

  const Game = selectedGame ? GameMap[selectedGame] : null

  const BackButton = (
    <button
      className="m-2 rounded-sm border px-2 hover:ring-1"
      onClick={() => setSelectedGame(undefined)}
    >
      Go Back
    </button>
  )

  return (
    <>
      {selectedGame && BackButton}
      <main className="mx-auto flex w-full max-w-lg flex-col items-stretch gap-8 pb-4">
        {Game ? (
          <Game />
        ) : (
          <GameMenu onSelect={(game: GameOptions) => setSelectedGame(game)} />
        )}
      </main>
    </>
  )
}
