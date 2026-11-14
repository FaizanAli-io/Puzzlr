import { useState } from 'react'

import type { GameOptions } from '@/types'

import { Queens } from '@/games/queens/components/Queens'
import { Sudoku } from '@/games/sudoku/components/Sudoku'
import { GameMenu } from './GameMenu'
import { ThemeToggle } from './ThemeToggle'

const GameMap = {
  queens: Queens,
  sudoku: Sudoku,
}

export const PageWrapper = () => {
  const [selectedGame, setSelectedGame] = useState<GameOptions>()

  const Game = selectedGame ? GameMap[selectedGame] : null

  const BackButton = (
    <button
      className="btn fixed top-4 left-4 px-2 py-1"
      onClick={() => setSelectedGame(undefined)}
    >
      Back
    </button>
  )

  return (
    <>
      {selectedGame && BackButton}
      <ThemeToggle />
      <main className="mx-auto flex w-full max-w-lg flex-col items-stretch gap-8 px-4 pb-8">
        {Game ? (
          <Game />
        ) : (
          <GameMenu onSelect={(game: GameOptions) => setSelectedGame(game)} />
        )}
      </main>
    </>
  )
}
