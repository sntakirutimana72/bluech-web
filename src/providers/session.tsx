import React, {
  useState,
  useEffect,
  createContext,
  useCallback,
  useMemo,
} from 'react'
import { UsersController } from '../controllers'
import { isInit } from '../helpers/utils'

export type SessionContext = {
  authenticated?: boolean
  currentUser?: CurrentUser
  login: (currentUser: CurrentUser) => void
  logout: () => void
  restartSessionRefresh: () => void
}

type Props = { children: React.ReactNode }

const initialSession = {} as SessionContext

export const sessionContext = createContext<SessionContext>(initialSession)

const SessionProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>()
  const [authenticated, setAuthenticated] = useState<boolean>()

  const login = useCallback((user: CurrentUser) => {
    setCurrentUser(user)
    setAuthenticated(true)
  }, [])
  const logout = useCallback(() => {
    setAuthenticated(false)
    setCurrentUser(undefined)
  }, [])
  const restartSessionRefresh = useCallback(() => { }, [])

  useEffect(() => {
    let refreshTask: NodeJS.Timer

    if (!isInit(authenticated)) UsersController.signedUser().then(login, logout)
    if (authenticated) {
      refreshTask = setInterval(() => { UsersController.refresh().catch(logout) }, 3.48e+6)
    }
    return () => { clearInterval(refreshTask) }
  }, [
    currentUser,
    authenticated,
    login,
    logout,
    restartSessionRefresh,
  ])
  const session = useMemo<SessionContext>(
    () => ({
      currentUser, authenticated, login, logout, restartSessionRefresh,
    }),
    [
      currentUser,
      authenticated,
      login,
      logout,
      restartSessionRefresh,
    ],
  )
  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  )
}

export default SessionProvider
