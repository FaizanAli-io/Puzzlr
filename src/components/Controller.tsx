import type { GameControllerProps } from '@/types'

import { useState } from 'react'

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
    const { isValid, message } = gameUtils.checkGame(grid)

    setValid(isValid)
    setText(message)
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
