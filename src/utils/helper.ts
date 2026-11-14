export function checkAndReturnGameSize(grid: unknown[][]) {
  const gridSize = grid.length

  if (!gridSize || !grid.every((row) => row.length === gridSize))
    throw RangeError('Invalid grid dimensions')

  return gridSize
}

export function getCheckResult<T>(checks: [T[], string][], pending: string) {
  const conflicts = new Set(checks.flatMap(([cells]) => cells))
  const messages = checks.filter(([cells]) => cells.length).map(([, m]) => m)

  const result = messages.length
    ? { isValid: false, message: messages.join('\n') }
    : pending
      ? { isValid: undefined, message: pending }
      : { isValid: true, message: 'Congratulations, you solved the puzzle!' }

  return { ...result, conflicts }
}

export function parseGrid(input: unknown, key: string, sizes: number[]) {
  const rows = (input as Record<string, unknown> | null)?.[key]

  if (!Array.isArray(rows))
    throw new Error(`Expected a JSON object with a "${key}" array`)

  if (!sizes.includes(rows.length))
    throw new Error(
      `Board must have ${sizes.join(', ')} rows, found ${rows.length}`,
    )

  rows.forEach((row, i) => {
    if (!Array.isArray(row) || row.length !== rows.length)
      throw new Error(
        `Board must be square: row ${i + 1} should have ${rows.length} cells`,
      )
  })

  return rows as unknown[][]
}
