import type { GameOptions } from '@/types'

import { Header } from '@/components/Header'

const games: GameOptions[] = ['queens', 'sudoku']

export const GameMenu = ({
  onSelect,
}: {
  onSelect: (game: GameOptions) => void
}) => (
  <>
    <Header title="Puzzlr" description="Player and solver for various games" />
    {games.map((game) => (
      <button
        key={game}
        className="btn p-4 text-xl font-bold capitalize"
        onClick={() => onSelect(game)}
      >
        {game}
      </button>
    ))}
  </>
)
