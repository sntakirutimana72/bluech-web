import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  createContext,
} from 'react'
import { createCable } from '@anycable/web'
import { Cable } from '@anycable/core'
import SessionStore from '../store/session'
import useSession from '../hooks/session'

export type CableContext = {
  cable?: Cable
}

type Props = { children: React.ReactNode }

export const cableContext = createContext<CableContext>({})

const CableProvider = ({ children }: Props) => {
  const { authenticated } = useSession()
  const cableRef = useRef<Cable>()

  const disconnect = useCallback(() => {
    if (cableRef.current) {
      cableRef.current.disconnect()
      cableRef.current = undefined
    }
  }, [])

  useEffect(
    () => {
      if (cableRef.current && !authenticated) { disconnect() }
      if (!cableRef.current && authenticated) {
        cableRef.current = createCable(process.env.REACT_APP_BLUECH_RB_API_CABLE_URL!, {
          websocketOptions: {
            headers: { Authorization: SessionStore.fetch()! },
          },
        })
      }
      return () => { disconnect() }
    },
    [authenticated, cableRef],
  )

  const initialValue = useMemo(
    () => ({
      cable: cableRef.current,
    }),
    [cableRef],
  )

  return (
    <cableContext.Provider value={initialValue}>
      {children}
    </cableContext.Provider>
  )
}

export default CableProvider
