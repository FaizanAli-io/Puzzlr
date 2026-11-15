import { GamePage } from '@/components/GamePage'

import { getGame } from '@/utils/gameSelector'
import schema from '../schema.json'
import * as gameUtils from '../utils/gameState'
import { Grid } from './Grid'

export const Tango = () => (
  <GamePage
    type="tango"
    title="Tango"
    schema={schema}
    Grid={Grid}
    gameUtils={gameUtils}
    loadGrid={(index) => gameUtils.loadGame(getGame('tango', index))}
  />
)
