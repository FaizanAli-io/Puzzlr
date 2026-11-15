import type {
  AnyGameSession,
  GameSession,
  QueensSession,
  Session,
  SudokuSession,
  TangoSession,
} from '@/session'
import type { GameOptions } from '@/types'
import type { Tool } from './useWebMCP'

import { GAME_OPTIONS } from '@/types'

import { placeQueens, toggleQueen } from '@/games/queens/utils/gameState'
import sudokuSchema from '@/games/sudoku/schema.json'
import { updateCell } from '@/games/sudoku/utils/gameState'
import { updateCell as updateTangoCell } from '@/games/tango/utils/gameState'
import { getGameList } from '@/utils/gameSelector'

// Tool definitions (name, description, schema) must not depend on game state,
// so clients can rely on them. Anything that varies with the loaded puzzle is
// reported in tool results and errors instead.

// The largest supported Sudoku board, so the schema can bound values without
// depending on which puzzle is loaded.
const MAX_SUDOKU_SIZE = Math.max(
  ...sudokuSchema.properties.grid.oneOf.map(({ minItems }) => minItems),
)

const cellSchema = {
  type: 'object',
  properties: {
    row: { type: 'integer', minimum: 0 },
    col: { type: 'integer', minimum: 0 },
  },
  required: ['row', 'col'],
}

export const appTools = ({
  openGame,
  closeGame,
}: NonNullable<Session['app']>): Tool[] => [
  {
    name: 'open_game',
    description: 'Open a game from the menu.',
    inputSchema: {
      type: 'object',
      properties: { game: { enum: [...GAME_OPTIONS] } },
      required: ['game'],
    },
    execute: ({ game }: { game: GameOptions }) => {
      if (!GAME_OPTIONS.includes(game)) throw new Error('Unknown game')

      openGame(game)

      return `Opened ${game}.`
    },
  },
  {
    name: 'back_to_menu',
    description: 'Return to the game menu.',
    execute: () => {
      closeGame()

      return 'Returned to the menu.'
    },
  },
]

const commonTools = <T>({
  type,
  schema,
  changeGame,
  importGame,
  parseGame,
  actions,
}: GameSession<GameOptions, T>): Tool[] => {
  const games = getGameList(type)

  return [
    {
      name: `${type}_select_puzzle`,
      description: `Load a built-in ${type} puzzle by number (1-${games.length}), resetting the board.`,
      inputSchema: {
        type: 'object',
        properties: {
          number: { type: 'integer', minimum: 1, maximum: games.length },
        },
        required: ['number'],
      },
      execute: ({ number }: { number: number }) => {
        if (!games[number - 1])
          throw new Error(`No such puzzle, choose 1-${games.length}`)

        changeGame(number - 1)

        const game = games[number - 1]
        const size = 'size' in game ? ` (${game.size}x${game.size})` : ''

        return `Loaded puzzle ${number} of ${games.length}${size}.`
      },
    },
    {
      name: `${type}_import_puzzle`,
      description: `Load a custom ${type} puzzle onto the board.`,
      inputSchema: {
        type: 'object',
        properties: { puzzle: schema },
        required: ['puzzle'],
      },
      execute: ({ puzzle }) => {
        importGame(parseGame(puzzle))

        return 'Loaded the custom puzzle.'
      },
    },
    {
      name: `${type}_check_board`,
      description: `Check the ${type} board for conflicts and whether it is solved.`,
      annotations: { readOnlyHint: true },
      execute: actions.check,
    },
    {
      name: `${type}_solve_board`,
      description: `Run the ${type} solver and fill in the solution, if one is found.`,
      execute: actions.solve,
    },
    {
      name: `${type}_reset_board`,
      description: `Reset the ${type} board to the starting puzzle.`,
      execute: actions.reset,
    },
  ]
}

const queensTools = ({ grid, setGrid }: QueensSession): Tool[] => {
  const checkCell = (row: number, col: number, path: string) => {
    if (!grid[row]?.[col])
      throw new Error(
        `${path}: (${row}, ${col}) is outside the ${grid.length}x${grid.length} board`,
      )
  }

  return [
    {
      name: 'queens_get_board',
      description:
        'Get the Queens board: one string of region letters per row, and the queens placed so far as 0-indexed {row, col} objects, the same format queens_set_queens accepts.',
      annotations: { readOnlyHint: true },
      execute: () => ({
        size: grid.length,
        regions: grid.map((row) => row.map((cell) => cell.region).join('')),
        queens: grid.flatMap((row, i) =>
          row.flatMap((cell, j) =>
            cell.isClicked ? [{ row: i, col: j }] : [],
          ),
        ),
      }),
    },
    {
      name: 'queens_toggle_queen',
      description: 'Place or remove a queen at a 0-indexed row and column.',
      inputSchema: cellSchema,
      execute: ({ row, col }: { row: number; col: number }) => {
        checkCell(row, col, 'cell')

        const placed = !grid[row][col].isClicked

        setGrid((prev) => toggleQueen(prev, row, col))

        return `${placed ? 'Placed' : 'Removed'} a queen at row ${row}, col ${col}.`
      },
    },
    {
      name: 'queens_set_queens',
      description:
        'Replace every queen on the board with exactly these 0-indexed cells. An empty list clears the board. Nothing changes if any cell is invalid.',
      inputSchema: {
        type: 'object',
        properties: { queens: { type: 'array', items: cellSchema } },
        required: ['queens'],
      },
      execute: ({ queens }: { queens: { row: number; col: number }[] }) => {
        queens.forEach(({ row, col }, i) => checkCell(row, col, `queens[${i}]`))

        setGrid((prev) =>
          placeQueens(
            prev,
            queens.map(({ row, col }) => [row, col]),
          ),
        )

        const count = new Set(queens.map(({ row, col }) => `${row},${col}`))
          .size

        return `The board now has ${count} queen${count === 1 ? '' : 's'}.`
      },
    },
  ]
}

const sudokuTools = ({ grid, setGrid }: SudokuSession): Tool[] => {
  type Cell = { row: number; col: number; value: number }

  const validate = ({ row, col, value }: Cell, path: string) => {
    const size = grid.length

    if (!grid[row]?.[col])
      throw new Error(
        `${path}: (${row}, ${col}) is outside the ${size}x${size} board`,
      )
    if (grid[row][col].fixed)
      throw new Error(`${path}: (${row}, ${col}) is a given and cannot change`)
    if (!Number.isInteger(value) || value < 0)
      throw new Error(
        `${path}.value: ${value} must be a whole number from 0 to ${size}`,
      )
    if (value > size)
      throw new Error(
        `${path}.value: ${value} exceeds the board size ${size} (use 0-${size})`,
      )
  }

  const setCells = (cells: Cell[], path: string) => {
    cells.forEach((cell, i) => validate(cell, `${path}[${i}]`))

    setGrid((prev) =>
      cells.reduce(
        (next, { row, col, value }) => updateCell(next, row, col, () => value),
        prev,
      ),
    )

    return `Set ${cells.length} cell${cells.length === 1 ? '' : 's'}.`
  }

  const cellSchemaWithValue = {
    ...cellSchema,
    properties: {
      ...cellSchema.properties,
      value: { type: 'integer', minimum: 0, maximum: MAX_SUDOKU_SIZE },
    },
    required: [...cellSchema.required, 'value'],
  }

  return [
    {
      name: 'sudoku_get_board',
      description:
        'Get the Sudoku board: its size, box shape, values (0 is empty), which cells are given, and the editable cells as {row, col, value} objects, the same format sudoku_set_cells accepts.',
      annotations: { readOnlyHint: true },
      execute: () => ({
        size: grid.length,
        boxes: grid.length === 9 ? '3x3' : '2 rows by 3 columns',
        values: grid.map((row) => row.map((cell) => cell.value)),
        given: grid.map((row) => row.map((cell) => cell.fixed)),
        cells: grid.flatMap((row, i) =>
          row.flatMap((cell, j) =>
            cell.fixed ? [] : [{ row: i, col: j, value: cell.value }],
          ),
        ),
      }),
    },
    {
      name: 'sudoku_set_cell',
      description:
        'Set a cell to a number up to the board size, or 0 to clear it. Rows and columns are 0-indexed.',
      inputSchema: cellSchemaWithValue,
      execute: (cell: Cell) => {
        validate(cell, 'cell')

        return setCells([cell], 'cells')
      },
    },
    {
      name: 'sudoku_set_cells',
      description:
        'Set many cells in one call, each to a number up to the board size or 0 to clear it. Rows and columns are 0-indexed. Nothing changes if any cell is invalid.',
      inputSchema: {
        type: 'object',
        properties: {
          cells: { type: 'array', minItems: 1, items: cellSchemaWithValue },
        },
        required: ['cells'],
      },
      execute: ({ cells }: { cells: Cell[] }) => setCells(cells, 'cells'),
    },
  ]
}

const tangoTools = ({ grid, setGrid }: TangoSession): Tool[] => [
  {
    name: 'tango_get_board',
    description:
      'Get the Tango board: its size, values (0 is empty, 1 is a sun, 2 is a moon), which cells are given, and the constraints between adjacent cells as {cells, type} objects, the same format tango_import_puzzle accepts.',
    annotations: { readOnlyHint: true },
    execute: () => ({
      size: grid.length,
      values: grid.map((row) => row.map((cell) => cell.value)),
      given: grid.map((row) => row.map((cell) => cell.fixed)),
      constraints: grid.flatMap((row, i) =>
        row.flatMap((cell, j) => [
          ...(cell.right
            ? [
                {
                  cells: [
                    [i, j],
                    [i, j + 1],
                  ],
                  type: cell.right,
                },
              ]
            : []),
          ...(cell.down
            ? [
                {
                  cells: [
                    [i, j],
                    [i + 1, j],
                  ],
                  type: cell.down,
                },
              ]
            : []),
        ]),
      ),
    }),
  },
  {
    name: 'tango_set_cell',
    description:
      'Set a cell to 1 (sun), 2 (moon) or 0 (empty). Rows and columns are 0-indexed.',
    inputSchema: {
      ...cellSchema,
      properties: {
        ...cellSchema.properties,
        value: { enum: [0, 1, 2] },
      },
      required: [...cellSchema.required, 'value'],
    },
    execute: ({
      row,
      col,
      value,
    }: {
      row: number
      col: number
      value: 0 | 1 | 2
    }) => {
      const size = grid.length

      if (!grid[row]?.[col])
        throw new Error(`(${row}, ${col}) is outside the ${size}x${size} board`)
      if (grid[row][col].fixed)
        throw new Error(`(${row}, ${col}) is a given and cannot change`)
      if (![0, 1, 2].includes(value))
        throw new Error(`${value} must be 0 (empty), 1 (sun) or 2 (moon)`)

      setGrid((prev) => updateTangoCell(prev, row, col, () => value))

      return `Set row ${row}, col ${col} to ${value}.`
    },
  },
]

export const gameTools = (game: AnyGameSession): Tool[] => {
  switch (game.type) {
    case 'queens':
      return [...commonTools(game), ...queensTools(game)]
    case 'sudoku':
      return [...commonTools(game), ...sudokuTools(game)]
    case 'tango':
      return [...commonTools(game), ...tangoTools(game)]
  }
}
