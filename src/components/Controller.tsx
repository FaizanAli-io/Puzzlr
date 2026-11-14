import type { GameActions, GameResult } from '@/types'

export const Controller = ({
  result,
  actions,
  onClear,
}: {
  result?: GameResult
  actions: GameActions
  onClear: () => void
}) => {
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
          <button key={label} className="btn capitalize" onClick={onClick}>
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
          <button className="btn" onClick={onClear}>
            Clear
          </button>
        </>
      )}
    </>
  )
}
