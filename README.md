# 🧩 Puzzlr

**Play. Think. Solve.**

Puzzlr is a collection of interactive logic puzzles, built from scratch with React and TypeScript. Each puzzle comes with its own gameplay, validation, and algorithmic solver.

A personal project exploring problem-solving, recursion, backtracking, and the algorithms behind logic puzzles.

## 🎮 Games

| Puzzle          | Status      | Features                                                   |
| --------------- | ----------- | ---------------------------------------------------------- |
| 👑 Queens       | ✅ Playable | Interactive board, live validation, pruned backtracking    |
| 🔢 Sudoku       | 🚧 WIP      | Interactive board, live validation, constraint propagation |
| ☀️ Tango        | 🚧 WIP      | Interactive board, live validation, solver not yet written |
| 🧩 More puzzles | 💡 Future   | More logic challenges to come                              |

### 👑 Queens

Place exactly one queen in each row, column, and colored region. Queens cannot touch one another, even diagonally.

- 5 puzzles, from 8×8 up to 12×12
- **Check** reports whether the board is solved, still in progress, or in conflict, and outlines the offending queens in red
- **Solve** runs a recursive backtracking solver and places the queens, with a step count and timing

### 🔢 Sudoku

Fill every row, column, and box with each number exactly once.

- 4 puzzles in 6×6 and 9×9
- **Check** reports whether the board is solved, still in progress, or in conflict, and outlines the repeated numbers in red
- **Solve** applies constraint propagation (naked and hidden singles) and fills in the solution, with a step count and timing
- Boards that need guessing are not solved yet (see the roadmap)

## 📥 Custom Games

Each game page has an **Import custom game** panel: paste JSON or choose a `.json` file, then press Load. The board switches to a **Custom** entry in the game picker. Invalid input shows a specific error and leaves the current board untouched.

The formats are defined by JSON Schemas, [Queens](src/games/queens/schema.json), [Sudoku](src/games/sudoku/schema.json) and [Tango](src/games/tango/schema.json), which are also what the WebMCP `import_puzzle` tool advertises.

```jsonc
// Queens: 8×8 to 12×12, one letter A-L per cell, exactly as many regions as rows
{ "regions": [["A", "A", "B", ...], ...] }

// Sudoku: 6×6 or 9×9, 0 for an empty cell
{ "grid": [[0, 0, 0, 2, 0, 0], ...] }

// Tango: 6×6, 0 empty, 1 sun, 2 moon, plus optional constraints between adjacent cells
{ "grid": [[0, 1, 0, 0, 2, 0], ...], "constraints": [{ "cells": [[0, 0], [0, 1]], "type": "equal" }] }
```

Beyond the schema, the importer checks that the board is square, that Queens uses exactly one region per row, and that Sudoku's given numbers don't conflict.

## 🧠 How the Solvers Work

**Queens** places one queen per row and recurses to the next row. After every placement it removes the used column and region, plus the touching cells in the next row. It abandons a branch as soon as a remaining row, column, or region has no candidate cell left. On the 12×12 board this cut the search from 12,150 steps to under 30.

**Sudoku** keeps a set of candidate numbers for every cell. It repeatedly fills cells that have only one candidate (naked singles) and numbers that fit only one cell in a row, column, or box (hidden singles), propagating each placement to the affected cells.

## 🤖 WebMCP

In browsers that support [WebMCP](https://developer.chrome.com/docs/ai/webmcp/imperative-api), the page registers tools that an in-browser agent can use to play the live board. Tools appear only while the matching UI is on screen.

| Where    | Tools                                                                                                                                                                            |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Any page | `open_game`, `back_to_menu`                                                                                                                                                      |
| Queens   | `queens_select_puzzle`, `queens_import_puzzle`, `queens_check_board`, `queens_solve_board`, `queens_reset_board`, `queens_get_board`, `queens_toggle_queen`, `queens_set_queens` |
| Tango    | `tango_select_puzzle`, `tango_import_puzzle`, `tango_check_board`, `tango_solve_board`, `tango_reset_board`, `tango_get_board`, `tango_set_cell`                                 |
| Sudoku   | `sudoku_select_puzzle`, `sudoku_import_puzzle`, `sudoku_check_board`, `sudoku_solve_board`, `sudoku_reset_board`, `sudoku_get_board`, `sudoku_set_cell`, `sudoku_set_cells`      |

Tool definitions never depend on the board: names are prefixed per game, and anything that varies with the loaded puzzle (size, box shape, valid ranges) is reported in tool results and errors. Tools stay registered while a game is open, so clients don't need to re-fetch them after a move.

WebMCP is an early API (an origin trial in Chrome at the time of writing). Without it the tools are simply not registered, and the app behaves as before.

## 🛠️ Tech Stack

- **React** — Component-based UI
- **TypeScript** — Type-safe application logic
- **Vite** — Development and build tooling
- **Tailwind CSS** — Styling, with a light and dark theme

The puzzle solvers are implemented from scratch, without external solving libraries.

## 🚀 Getting Started

**Prerequisites:** Node.js and npm.

```bash
git clone https://github.com/FaizanAli-io/Puzzlr.git
cd Puzzlr
npm install
npm run dev
```

Open the local URL displayed in your terminal.

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start the development server       |
| `npm run build`  | Typecheck and build for production |
| `npm run lint`   | Lint the codebase                  |
| `npm run format` | Format the codebase                |

## 📁 Project Structure

```
src/
├── components/   Shared UI: page wrapper, game page, menu, controller, import
├── games/
│   ├── queens/   Components, solver, schema, and game state for Queens
│   ├── sudoku/   Components, solver, schema, and game state for Sudoku
│   └── tango/    Components, solver stub, schema, and game state for Tango
├── utils/        Shared helpers: game data, state hook, theme, units
├── session.ts    A small store publishing what is on screen
└── webmcp/       WebMCP tools, built from the published session
```

Each game exposes the same `resetGame`, `printGame`, `checkGame`, `solveGame`, and `parseGame` functions plus a `Grid` component, so a new puzzle is one folder and one thin page that renders the shared `GamePage`.

The app never imports `webmcp/`. `GamePage` and `PageWrapper` publish their state to `session.ts`, and `webmcp/` subscribes to it and registers the tools, so the whole feature can be deleted by removing the folder and one line in `main.tsx`.

## 🗺️ Roadmap

- [x] Build an interactive Queens game with validation
- [x] Build a pruned recursive backtracking solver
- [x] Support multiple puzzle sizes
- [x] Add Sudoku with validation
- [x] Add dark mode
- [ ] Add backtracking to the Sudoku solver
- [ ] Explore additional logic puzzles

## 👨‍💻 Author

Built with curiosity (and a healthy amount of debugging) by **Faizan Ali**.

---

_Every puzzle is a problem waiting to be solved._
