import { useEffect, useMemo } from 'react'
import { createCable } from '@anycable/web'
import { SessionStore } from '../store'

const useCable = (url: string = process.env.REACT_APP_BLUECH_RB_API_CABLE_URL!) => {
  const cable = useMemo(() => createCable(url, {
    websocketOptions: {
      headers: {
        'Authorization': SessionStore.fetch()!
      }
    }
  }), [url])

  useEffect(() => { return () => { cable.disconnect() } })

  return { cable }
}

export default useCable
