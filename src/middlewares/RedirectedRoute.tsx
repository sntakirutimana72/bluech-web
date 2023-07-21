import { Navigate, useLocation, Outlet } from 'react-router-dom'
import type { SessionContext } from '../providers'

type Props = Pick<SessionContext, 'authenticated'> & {
  redirectTo: string
}

const RedirectedRoute = ({ redirectTo, authenticated }: Props) => {
  const { state } = useLocation()

  if (authenticated) {
    let nextTo = redirectTo
    if (state && state.nextTo !== process.env.REACT_APP_BLUECH_RB_API_LOGOUT) {
      nextTo = state.nextTo
    }
    return <Navigate to={nextTo} replace />
  }
  return <Outlet />
}

export default RedirectedRoute
