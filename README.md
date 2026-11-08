# 🧩 Puzzlr

**Play. Think. Solve.**

Puzzlr is a collection of interactive logic puzzles, built from scratch with React and TypeScript. Each puzzle comes with its own gameplay, validation, and algorithmic solver.

A personal project exploring problem-solving, recursion, backtracking, and the algorithms behind logic puzzles.

## 🎮 Games

| Puzzle          | Status      | Features                                                     |
| --------------- | ----------- | ------------------------------------------------------------ |
| 👑 Queens       | ✅ Playable | Interactive board, validation, recursive backtracking solver |
| 🔢 Sudoku       | 🚧 Planned  | Interactive Sudoku game and solver                           |
| 🧩 More puzzles | 💡 Future   | More logic challenges to come                                |

### 👑 Queens

Place exactly one queen in each row, column, and colored region. Queens cannot touch one another, even diagonally.

**Features**

- Multiple board sizes, including 8×8 through 12×12
- Interactive, color-coded puzzle boards
- Solution validation with descriptive feedback
- Automatic solver using recursive backtracking
- Solution highlighting
- Reset and board inspection controls

## 🛠️ Tech Stack

- **React** — Component-based UI
- **TypeScript** — Type-safe application logic
- **Vite** — Development and build tooling
- **Tailwind CSS** — Styling

The puzzle solvers are implemented from scratch, without external solving libraries.

## 🚀 Getting Started

**Prerequisites:** Node.js and npm.

Clone the repository:

```bash
git clone https://github.com/FaizanAli-io/Puzzlr.git
cd Puzzlr
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

To create a production build:

```bash
npm run build
```

## 🧠 Project Goals

Puzzlr is as much a learning project as it is a puzzle collection.

The goals are to:

- Explore different approaches to constraint-satisfaction problems.
- Design and implement puzzle-solving algorithms independently.
- Experiment with recursion, backtracking, and search optimizations.
- Build clean, reusable React components.
- Improve TypeScript and software engineering skills.

## 🗺️ Roadmap

- [x] Build an interactive Queens game
- [x] Implement Queens solution validation
- [x] Build a recursive backtracking solver
- [x] Support multiple puzzle sizes
- [ ] Add Sudoku
- [ ] Implement a Sudoku solver
- [ ] Explore additional logic puzzles

## 👨‍💻 Author

Built with curiosity (and a healthy amount of debugging) by **Faizan Ali**.

---

_Every puzzle is a problem waiting to be solved._
