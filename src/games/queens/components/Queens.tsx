import { GamePage } from '@/components/GamePage'

import { getGame } from '@/utils/gameSelector'
import schema from '../schema.json'
import * as gameUtils from '../utils/gameState'
import { Grid } from './Grid'

export const Queens = () => (
  <GamePage
    type="queens"
    title="Queens"
    schema={schema}
    Grid={Grid}
    gameUtils={gameUtils}
    loadGrid={(index) => gameUtils.resetGame(getGame('queens', index).regions)}
  />
)
