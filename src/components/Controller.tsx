import type { GameControllerProps } from '@/types'

import { useState } from 'react'

const TextBox = ({ text, valid }: { text: string; valid?: boolean }) => {
  const borderColorClass =
    valid === undefined
      ? 'border-neutral-300 dark:border-neutral-700'
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

export const Controller = <T,>({
  grid,
  setGrid,
  gameUtils,
}: GameControllerProps<T>) => {
  const [valid, setValid] = useState<boolean | undefined>(undefined)
  const [text, setText] = useState('')

  const handleReset = () => {
    setGrid((prev) => gameUtils.resetGame(prev))
    handleClear()
  }

  const handlePrint = () => setText(gameUtils.printGame(grid))

  const handleCheck = () => {
    const { isValid, message, newGrid } = gameUtils.checkGame(grid)

    setValid(isValid)
    setText(message)
    if (newGrid) setGrid(newGrid)
  }

  const handleSolve = () => {
    const { isValid, message, newGrid } = gameUtils.solveGame(grid)

    setValid(isValid)
    setText(message)
    setGrid(newGrid)
  }

  const handleClear = () => {
    setValid(undefined)
    setText('')
  }

  return (
    <>
      <div className="flex justify-between">
        <button className="btn" onClick={handleReset}>
          Reset
        </button>

        <button className="btn" onClick={handlePrint}>
          Print
        </button>

        <button className="btn" onClick={handleCheck}>
          Check
        </button>

        <button className="btn" onClick={handleSolve}>
          Solve
        </button>
      </div>
      {text && (
        <>
          <TextBox text={text} valid={valid} />
          <button className="btn" onClick={handleClear}>
            Clear
          </button>
        </>
      )}
    </>
  )
}
