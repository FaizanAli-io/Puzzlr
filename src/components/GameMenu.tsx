import type { GameOptions } from '@/types'

import { Header } from '@/components/Header'

export const GameMenu = ({
  onSelect,
}: {
  onSelect: (game: GameOptions) => void
}) => {
  return (
    <>
      <Header
        title="Puzzlr"
        description="Player and solver for various games"
      />
      <button
        className="btn p-4 text-xl font-bold"
        onClick={() => onSelect('queens')}
      >
        Queens
      </button>
      <button
        className="btn p-4 text-xl font-bold"
        onClick={() => onSelect('sudoku')}
      >
        Sudoku
      </button>
    </>
  )
}
