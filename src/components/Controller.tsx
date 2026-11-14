import type { GameControllerProps } from '@/types'

import { useState } from 'react'

export const Controller = <T,>({
  grid,
  setGrid,
  gameUtils,
}: GameControllerProps<T>) => {
  const [result, setResult] = useState<{
    message: string
    isValid?: boolean
  }>()

  const handleCheck = () => {
    const { newGrid, ...checked } = gameUtils.checkGame(grid)

    setResult(checked)
    if (newGrid) setGrid(newGrid)
  }

  const handleSolve = () => {
    const { newGrid, ...solved } = gameUtils.solveGame(grid)

    setResult(solved)
    setGrid(newGrid)
  }

  const actions = {
    Reset: () => {
      setGrid(gameUtils.resetGame(grid))
      setResult(undefined)
    },
    Print: () => setResult({ message: gameUtils.printGame(grid) }),
    Check: handleCheck,
    Solve: handleSolve,
  }

  const borderClass =
    result?.isValid === undefined
      ? 'border-neutral-300 dark:border-neutral-700'
      : result.isValid
        ? 'border-green-500'
        : 'border-red-500'

  return (
    <>
      <div className="flex justify-between">
        {Object.entries(actions).map(([label, onClick]) => (
          <button key={label} className="btn" onClick={onClick}>
            {label}
          </button>
        ))}
      </div>
      {result && (
        <>
          <pre
            className={`overflow-auto rounded-md border-2 ${borderClass} p-2 whitespace-pre-wrap`}
          >
            {result.message}
          </pre>
          <button className="btn" onClick={() => setResult(undefined)}>
            Clear
          </button>
        </>
      )}
    </>
  )
}
