import { useState } from 'react'

import type { GameOptionsProps } from '../types'

import {
  checkGameState,
  highlightCells,
  printGameState,
  resetGameState,
} from '../utils/gameState'

import { GameSolver } from '../utils/gameSolver'

const TextBox = ({ text, valid }: { text: string; valid?: boolean }) => {
  const borderColorClass =
    valid === undefined
      ? 'border-black'
      : valid
        ? 'border-green-500'
        : 'border-red-500'

  return (
    <pre
      className={`overflow-auto rounded-md border-2 ${borderColorClass} p-2 whitespace-pre-wrap`}
    >
      {text}
    </pre>
  )
}

export const GameOptions = ({ grid, setGrid }: GameOptionsProps) => {
  const [valid, setValid] = useState<boolean | undefined>(undefined)
  const [text, setText] = useState('')

  const handleReset = () => {
    setGrid((prev) => resetGameState(prev))
    handleClear()
  }

  const handlePrint = () => setText(printGameState(grid))

  const handleCheck = () => {
    const { isValid, message } = checkGameState(grid)
    setValid(isValid)
    setText(message)
  }

  const handleSolve = () => {
    const { result, solution, metadata } = new GameSolver(grid).solve()
    const statistics = `${metadata.duration} ms / ${metadata.recursions} calls`

    setValid(result)
    setText(
      result
        ? `A solution was found for this game (${statistics})`
        : `No solution possible for this game (${statistics})`,
    )

    setGrid((prev) => highlightCells(prev, solution))
  }

  const handleClear = () => {
    setValid(undefined)
    setText('')
  }

  const buttonClasses = 'border rounded-md p-2'

  return (
    <>
      <div className="flex justify-between">
        <button className={buttonClasses} onClick={handleReset}>
          Reset
        </button>

        <button className={buttonClasses} onClick={handlePrint}>
          Print
        </button>

        <button className={buttonClasses} onClick={handleCheck}>
          Check
        </button>

        <button className={buttonClasses} onClick={handleSolve}>
          Solve
        </button>
      </div>
      {text && (
        <>
          <TextBox text={text} valid={valid} />
          <button className={buttonClasses} onClick={handleClear}>
            Clear
          </button>
        </>
      )}
    </>
  )
}
