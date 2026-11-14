import { useSyncExternalStore } from 'react'

import { getSession, subscribeSession } from '@/session'

import { appTools, gameTools } from './tools'
import { useWebMCP } from './useWebMCP'

// Registers WebMCP tools for whatever the app currently has on screen. Nothing
// in the app imports this; it only reads the published session.
export const WebMCP = () => {
  const { app, game } = useSyncExternalStore(subscribeSession, getSession)

  useWebMCP([...(app ? appTools(app) : []), ...(game ? gameTools(game) : [])])

  return null
}
