import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useCallback,
  useMemo,
} from 'react'
import { UsersController } from '@/controllers'
import { isInit, nilFunc } from '@/helpers/utils'

export type SessionContext = {
  authenticated?: boolean
  currentUser?: CurrentUser
  login(currentUser: CurrentUser): void
  logout(): void
  restartSessionRefresh(): void
}

type Props = { children: React.ReactNode }

const initialSession = {} as SessionContext

export const sessionContext = createContext<SessionContext>(initialSession)

const SessionProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>()
  const [authenticated, setAuthenticated] = useState<boolean>()
  const refresher = useRef<NodeJS.Timer>()

  const login = useCallback((user: CurrentUser) => {
    setCurrentUser(user)
    setAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    setAuthenticated(false)
    setCurrentUser(undefined)
  }, [])

  const cancelAutoRefresher = useCallback(() => {
    if (refresher.current) {
      clearInterval(refresher.current)
      refresher.current = undefined
    }
  }, [])

  const scheduleAutoRefresh = useCallback(() => {
    refresher.current = setInterval(() => {
      UsersController.refresh().then(nilFunc, logout)
    }, parseFloat(process.env.REACT_APP_SESSION_AUTO_REFRESH_TIME!))
  }, [])

  const restartSessionRefresh = useCallback(() => {
    cancelAutoRefresher()
    scheduleAutoRefresh()
  }, [])

  useEffect(() => {
    if (!isInit(authenticated)) {
      UsersController.signedUser().then(login, logout)
    } else if (authenticated) {
      scheduleAutoRefresh()
    }
    return cancelAutoRefresher
  }, [authenticated])

  const session = useMemo<SessionContext>(() => ({
    currentUser,
    authenticated,
    login,
    logout,
    restartSessionRefresh,
  }), [
    currentUser,
    authenticated,
    login,
    logout,
    restartSessionRefresh,
  ])

  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  )
}

export default SessionProvider
