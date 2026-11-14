import { useState } from 'react'

export const ImportGame = <T,>({
  parse,
  onImport,
}: {
  parse: (input: unknown) => T
  onImport: (grid: T) => void
}) => {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const load = (input: () => unknown) => {
    try {
      onImport(parse(input()))
      setText('')
      setError('')
    } catch (e) {
      setError(
        e instanceof SyntaxError
          ? `Invalid JSON: ${e.message}`
          : e instanceof Error
            ? e.message
            : String(e),
      )
    }
  }

  return (
    <details className="flex flex-col gap-2">
      <summary className="cursor-pointer">Import custom game</summary>
      <div className="flex flex-col gap-2 pt-2">
        <textarea
          value={text}
          rows={6}
          placeholder="Paste puzzle JSON, or choose a .json file"
          className="rounded-md border border-neutral-300 bg-transparent p-2 font-mono text-sm dark:border-neutral-700"
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          accept=".json,application/json"
          onChange={(e) => e.target.files?.[0]?.text().then(setText)}
        />
        <button className="btn" onClick={() => load(() => JSON.parse(text))}>
          Load
        </button>
        {error && (
          <p className="text-sm whitespace-pre-wrap text-red-500">{error}</p>
        )}
      </div>
    </details>
  )
}
