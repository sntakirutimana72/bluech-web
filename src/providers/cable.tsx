import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  createContext,
} from 'react'
import { createCable } from '@anycable/web'
import { Cable } from '@anycable/core'
import { nilFunc } from '@/helpers/utils'
import SessionStore from '@/store/session'
import useSession from '@/hooks/session'

export type CableContext = {
  cable?: Cable
}

type Props = { children: React.ReactNode }

export const cableContext = createContext<CableContext>({})

const CableProvider = ({ children }: Props) => {
  const { authenticated } = useSession()
  const [cable, setCable] = useState<Cable>()

  const connect = useCallback(() => {
    const authToken = SessionStore.fetch()
    const pipe = createCable(`${process.env.REACT_APP_CABLE_URL!}?X-Token=${authToken}`)
    pipe.connect().then(() => setCable(pipe), nilFunc)
  }, [])

  const disconnect = useCallback(() => {
    if (cable) {
      cable.disconnect()
      setCable(undefined)
    }
  }, [])

  useEffect(() => {
    if (!authenticated) {
      disconnect()
    } else if (!cable && authenticated) {
      connect()
    }
    return disconnect
  }, [authenticated])

  const initialValue = useMemo(() => ({ cable }), [cable])

  return (
    <cableContext.Provider value={initialValue}>
      {children}
    </cableContext.Provider>
  )
}

export default CableProvider
