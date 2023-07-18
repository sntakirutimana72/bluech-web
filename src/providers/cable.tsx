import React, {
  useEffect,
  useState,
  useMemo,
  createContext,
} from 'react'
import { Cable } from '@anycable/core'
import { createCable } from '@anycable/web'
import SessionStore from "../store/session"
import useSession from '../hooks/session'

export type CableContext = {
  cable?: Cable
}
type Props = { children: React.ReactNode }

export const cableContext = createContext<CableContext>({})
const CableProvider = ({ children }: Props) => {
  const { authenticated } = useSession()
  const [ cable, setCable ] = useState<Cable>()

  const disconnect = () => {
    if (cable) {
      cable.disconnect()
      setCable(undefined)
    }
  }
  useEffect(
    () => {
      if (cable && !authenticated) { disconnect() }
      if (!cable && authenticated) {
        const newCable = createCable(
          process.env.REACT_APP_BLUECH_RB_API_CABLE_URL!, {
            websocketOptions: {
              headers: {
                'Authorization': SessionStore.fetch()!
              }
            }
          }
        )
        setCable(newCable)
      }
      return () => { disconnect() }
    }, [ authenticated, cable ]
  )
  const value = useMemo(() => ({ cable }), [cable])
  return (
    <cableContext.Provider value={value}>
      {children}
    </cableContext.Provider>
  )
}

export default CableProvider
