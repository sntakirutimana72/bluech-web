import { useEffect } from 'react'
import type { SessionContext } from '@/providers'
import { UsersController } from '@/controllers'
import { RolexWaiter } from '@/components/elements/Waiters'

type Props = Pick<SessionContext, 'logout'>

const Logout = ({ logout }: Props) => {
  useEffect(() => {
    UsersController.logout().then(logout)
  }, [])

  return (
    <div className="logout">
      <RolexWaiter />
      <p className="animate-pulse text-gradient">Logging out</p>
    </div>
  )
}

export default Logout
