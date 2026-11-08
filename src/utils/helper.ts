export function checkAndReturnGameSize(grid: unknown[][]) {
  const gridSize = grid.length

  if (!gridSize || !grid.every((row) => row.length === gridSize))
    throw RangeError('Invalid grid dimensions')

  return gridSize
}
