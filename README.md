# 🧩 Puzzlr

**Play. Think. Solve.**

Puzzlr is a collection of interactive logic puzzles, built from scratch with React and TypeScript. Each puzzle comes with its own gameplay, validation, and algorithmic solver.

A personal project exploring problem-solving, recursion, backtracking, and the algorithms behind logic puzzles.

## 🎮 Games

| Puzzle          | Status      | Features                                                   |
| --------------- | ----------- | ---------------------------------------------------------- |
| 👑 Queens       | ✅ Playable | Interactive board, live validation, pruned backtracking    |
| 🔢 Sudoku       | 🚧 WIP      | Interactive board, live validation, constraint propagation |
| 🧩 More puzzles | 💡 Future   | More logic challenges to come                              |

### 👑 Queens

Place exactly one queen in each row, column, and colored region. Queens cannot touch one another, even diagonally.

- 5 puzzles, from 8×8 up to 12×12
- **Check** reports whether the board is solved, still in progress, or in conflict, and outlines the offending queens in red
- **Solve** runs a recursive backtracking solver and highlights the solution, with a step count and timing

### 🔢 Sudoku

Fill every row, column, and box with each number exactly once.

- 4 puzzles in 6×6 and 9×9
- **Check** reports whether the board is solved, still in progress, or in conflict, and outlines the repeated numbers in red
- **Solve** applies constraint propagation (naked and hidden singles) and shows the solution in green, with a step count and timing
- Boards that need guessing are not solved yet (see the roadmap)

## 🧠 How the Solvers Work

**Queens** places one queen per row and recurses to the next row. After every placement it removes the used column and region, plus the touching cells in the next row. It abandons a branch as soon as a remaining row, column, or region has no candidate cell left. On the 12×12 board this cut the search from 12,150 steps to under 30.

**Sudoku** keeps a set of candidate numbers for every cell. It repeatedly fills cells that have only one candidate (naked singles) and numbers that fit only one cell in a row, column, or box (hidden singles), propagating each placement to the affected cells.

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
├── components/   Shared UI: page wrapper, menu, header, controller
├── games/
│   ├── queens/   Components, solver, and game state for Queens
│   └── sudoku/   Components, solver, and game state for Sudoku
└── utils/        Shared helpers: game selection, state hook, theme, units
```

Each game exposes the same `resetGame`, `printGame`, `checkGame`, and `solveGame` functions, so a new puzzle plugs into the shared controller without UI changes.

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
