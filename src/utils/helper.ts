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
