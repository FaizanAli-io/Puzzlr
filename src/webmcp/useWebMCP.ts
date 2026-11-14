import { useEffect, useState } from 'react'

export type Tool = {
  name: string
  description: string
  inputSchema?: object
  annotations?: { readOnlyHint?: boolean }
  execute(input: Record<string, unknown>): unknown
}

type ModelContext = {
  registerTool(tool: Tool, options?: { signal: AbortSignal }): unknown
}

// Chrome's docs expose WebMCP on document; earlier drafts used navigator.
const getModelContext = () =>
  (document as { modelContext?: ModelContext }).modelContext ??
  (navigator as { modelContext?: ModelContext }).modelContext

const signatureOf = ({ description, inputSchema, annotations }: Tool) =>
  JSON.stringify([description, inputSchema, annotations])

// A tool stays registered for as long as its name, description and schema are
// unchanged. Its handler is looked up at call time, so re-renders that only
// change the closed-over game state never touch the registration.
const MAX_ATTEMPTS = 3

export function createToolRegistry() {
  let latest: Tool[] = []
  let retry: ReturnType<typeof setTimeout> | undefined

  const attempts = new Map<string, number>()

  const registered = new Map<
    string,
    { signature: string; controller: AbortController }
  >()

  const unregister = (name: string) => {
    registered.get(name)?.controller.abort()
    registered.delete(name)
  }

  const sync = (tools: Tool[]) => {
    latest = tools

    const modelContext = getModelContext()
    if (!modelContext) return

    const wanted = new Map(tools.map((tool) => [tool.name, signatureOf(tool)]))

    for (const [name, { signature }] of registered)
      if (wanted.get(name) !== signature) unregister(name)

    tools.forEach(async (tool) => {
      if (registered.has(tool.name)) return

      const controller = new AbortController()

      registered.set(tool.name, {
        signature: wanted.get(tool.name)!,
        controller,
      })

      try {
        await modelContext.registerTool(
          {
            ...tool,
            execute: (input) => {
              const current = latest.find(({ name }) => name === tool.name)

              if (!current) throw new Error('This tool is no longer available')

              return current.execute(input)
            },
          },
          { signal: controller.signal },
        )

        attempts.delete(tool.name)
      } catch (error) {
        console.warn(`WebMCP: could not register ${tool.name}`, error)

        // Forget the failed registration so a later sync can try again, and
        // schedule one in case nothing re-renders in the meantime.
        if (registered.get(tool.name)?.controller === controller)
          registered.delete(tool.name)

        const count = (attempts.get(tool.name) ?? 0) + 1
        attempts.set(tool.name, count)

        if (count < MAX_ATTEMPTS) {
          clearTimeout(retry)
          retry = setTimeout(() => sync(latest), 100 * count)
        }
      }
    })
  }

  const dispose = () => {
    clearTimeout(retry)
    attempts.clear()
    latest = []
    ;[...registered.keys()].forEach(unregister)
  }

  return { sync, dispose }
}

export function useWebMCP(tools: Tool[]) {
  const [registry] = useState(createToolRegistry)

  useEffect(() => registry.sync(tools))

  useEffect(() => registry.dispose, [registry])
}
