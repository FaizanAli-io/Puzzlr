import { GamePage } from '@/components/GamePage'

import { getGame } from '@/utils/gameSelector'
import schema from '../schema.json'
import * as gameUtils from '../utils/gameState'
import { Grid } from './Grid'

export const Sudoku = () => (
  <GamePage
    type="sudoku"
    title="Sudoku"
    schema={schema}
    Grid={Grid}
    gameUtils={gameUtils}
    loadGrid={(index) => gameUtils.resetGame(getGame('sudoku', index).grid)}
  />
)
