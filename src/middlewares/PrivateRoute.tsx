import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { SessionContextType } from '../providers'

type Props = Pick<SessionContextType, "authenticated"> & {
  redirectTo: string
}

const PrivateRoute = ({ redirectTo, authenticated }: Props) => {
  const { pathname } = useLocation()

  return authenticated ? <Outlet /> : <Navigate to={redirectTo} state={pathname} replace />
}

export default PrivateRoute
