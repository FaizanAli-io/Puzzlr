import { useEffect, useState } from 'react'

import type { GameOptions } from '@/types'

import { Queens } from '@/games/queens/components/Queens'
import { Sudoku } from '@/games/sudoku/components/Sudoku'
import { updateSession } from '@/session'
import { useTheme } from '@/utils/useTheme'
import { GameMenu } from './GameMenu'

const GameMap = {
  queens: Queens,
  sudoku: Sudoku,
}

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button className="btn fixed top-4 left-4 px-2 py-1" onClick={onClick}>
    Back
  </button>
)

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={toggleTheme}
      className="fixed top-4 right-4 flex h-6 w-11 items-center rounded-full border border-neutral-300 p-0.5 dark:border-neutral-700"
    >
      <span
        className={`size-4.5 rounded-full bg-neutral-900 transition-transform dark:bg-neutral-100 ${isDark ? 'translate-x-5' : ''}`}
      />
    </button>
  )
}

export const PageWrapper = () => {
  const [selectedGame, setSelectedGame] = useState<GameOptions>()

  const Game = selectedGame ? GameMap[selectedGame] : null

  useEffect(
    () =>
      updateSession({
        app: {
          openGame: setSelectedGame,
          closeGame: () => setSelectedGame(undefined),
        },
      }),
    [],
  )

  return (
    <>
      {selectedGame && (
        <BackButton onClick={() => setSelectedGame(undefined)} />
      )}
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
