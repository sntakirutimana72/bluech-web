import { memo } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { SessionContext } from '@/providers'

type Props = Pick<SessionContext, 'authenticated'> & {
  redirectTo: string
}

const PrivateRoute = ({ redirectTo, authenticated }: Props) => {
  const { pathname } = useLocation()

  return (
    authenticated
      ? <Outlet />
      : <Navigate to={redirectTo} state={{ nextTo: pathname }} replace />
  )
}

export default memo(PrivateRoute)
