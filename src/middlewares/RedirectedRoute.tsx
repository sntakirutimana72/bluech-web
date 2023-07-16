import { Navigate, useLocation, Outlet } from 'react-router-dom'
import type { SessionContextType } from '../providers'

type Props = Pick<SessionContextType, "authenticated"> & {
  redirectTo: string
}

const RedirectedRoute = ({ redirectTo, authenticated }: Props) => {
  const { state } = useLocation()

  if (authenticated) {
    let newState = state
    if (state === process.env.REACT_APP_BLUECH_RB_API_LOGOUT) {
      newState = null
    }
    return <Navigate to={newState || redirectTo} replace />
  }
  return <Outlet />
}

export default RedirectedRoute
