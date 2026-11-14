import type { GameOptions } from '@/types'

import { Header } from '@/components/Header'

export const GameMenu = ({
  onSelect,
}: {
  onSelect: (game: GameOptions) => void
}) => {
  const buttonClasses = 'btn p-4 text-xl font-bold'

  return (
    <>
      <Header
        title="Puzzlr"
        description="Player and solver for various games"
      />
      <button className={buttonClasses} onClick={() => onSelect('queens')}>
        Queens
      </button>
      <button className={buttonClasses} onClick={() => onSelect('sudoku')}>
        Sudoku
      </button>
    </>
  )
}
