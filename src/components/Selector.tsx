import type { GameSelectorProps } from '@/types'

import { getGameList } from '@/utils/gameSelector'

export const Selector = ({
  type,
  selectedGame,
  onChange,
}: GameSelectorProps) => (
  <select
    value={selectedGame}
    className="btn bg-transparent font-bold dark:bg-neutral-950"
    onChange={(e) => onChange(Number(e.target.value))}
  >
    {selectedGame === -1 && <option value={-1}>Custom</option>}
    {getGameList(type).map((game) => (
      <option key={game.id} value={game.id}>
        Game {game.id + 1}
        {'size' in game && ` (${game.size})`}
      </option>
    ))}
  </select>
)
