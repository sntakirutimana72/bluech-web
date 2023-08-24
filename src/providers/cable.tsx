import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  createContext,
} from 'react'
import { createCable } from '@anycable/web'
import { Cable } from '@anycable/core'
import { nilFunc } from '../helpers/utils'
import SessionStore from '../store/session'
import useSession from '../hooks/session'

export type CableContext = {
  cable?: Cable
}

type Props = { children: React.ReactNode }

export const cableContext = createContext<CableContext>({})

const CableProvider = ({ children }: Props) => {
  const { authenticated } = useSession()
  const [cable, setCable] = useState<Cable>()

  const connect = useCallback(() => {
    const url = process.env.REACT_APP_BLUECH_RB_API_CABLE_URL as string
    const liveCable = createCable(`${url}?X-Token=${SessionStore.fetch()}`)
    liveCable.connect().then(() => { setCable(liveCable) }, nilFunc)
  }, [])

  const disconnect = useCallback(() => {
    if (cable) {
      cable.disconnect()
      setCable(undefined)
    }
  }, [])

  useEffect(
    () => {
      if (cable && !authenticated) { disconnect() }
      if (!cable && authenticated) { connect() }
      return () => { disconnect() }
    },
    [authenticated],
  )

  const initialValue = useMemo(() => ({ cable }), [cable])

  return (
    <cableContext.Provider value={initialValue}>
      {children}
    </cableContext.Provider>
  )
}

export default CableProvider
