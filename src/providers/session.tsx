import React, {
  useState,
  useEffect,
  createContext,
  useCallback,
  useMemo,
} from 'react'
import { SessionController } from '../controllers'
import { isInit } from '../helpers/serializers/asserters'

export type SessionContextType = {
  authenticated?: boolean
  currentUser?: CurrentUser
  login: (currentUser: CurrentUser) => void
  logout: () => void
  restartSessionRefresh: () => void
}

type Props = { children: React.ReactNode }

const initialSession = {} as SessionContextType

export const SessionContext = createContext<SessionContextType>(initialSession)

const SessionProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>()
  const [authenticated, setAuthenticated] = useState<boolean>()

  const login = useCallback((user: CurrentUser) => {
    setCurrentUser(user);
    setAuthenticated(true);
  }, [])

  const logout = useCallback(() => {
    setAuthenticated(false);
    setCurrentUser(undefined);
  }, [])

  const restartSessionRefresh = useCallback(() => { }, [])

  useEffect(
    () => {
      let refreshTask: NodeJS.Timer

      if (!isInit(authenticated)) SessionController.signedUser().then(login, logout)
      if (authenticated) {
        refreshTask = setInterval(
          () => { SessionController.refresh().catch(logout) }, 3.48e+6
        )
      }
      return () => { refreshTask && clearInterval(refreshTask) }
    }, [
      currentUser,
      authenticated,
      login,
      logout,
      restartSessionRefresh
    ]
  )

  const session = useMemo<SessionContextType>(
    () => ({
      currentUser, authenticated, login, logout, restartSessionRefresh
    }),
    [
      currentUser,
      authenticated,
      login,
      logout,
      restartSessionRefresh
    ]
  )

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export default SessionProvider
