import type { GameSelectorProps } from '@/types'

import { GameSelector } from '@/utils/gameSelector'

export const Selector = ({
  type,
  selectedGame,
  onChange,
}: GameSelectorProps) => (
  <select
    value={selectedGame}
    className="rounded-md border px-4 py-2 font-bold"
    onChange={(e) => onChange(Number(e.target.value))}
  >
    {GameSelector.getGameList(type).map((game) => (
      <option key={game.id} value={game.id}>
        Game {game.id + 1} ({game.size})
      </option>
    ))}
  </select>
)
