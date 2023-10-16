import { memo } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import type { SessionContext } from '@/providers'
import { urls } from '@/config/routes'

type Props = Pick<SessionContext, 'authenticated'> & {
  redirectTo: string
}

const PublicRoute = ({ redirectTo, authenticated }: Props) => {
  const { state } = useLocation()

  if (authenticated) {
    let nextTo = redirectTo
    if (state && state.nextTo !== urls.LOGOUT) {
      nextTo = state.nextTo
    }
    return <Navigate to={nextTo} replace />
  }
  return <Outlet />
}

export default memo(PublicRoute)
