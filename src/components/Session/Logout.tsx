import { useEffect } from 'react'
import type { SessionContext } from '../../providers'
import { UsersController } from '../../controllers'

type Props = Pick<SessionContext, 'logout'>

const Logout = ({ logout }: Props) => {
  useEffect(() => { UsersController.logout().then(logout) })

  return (<>Logging out..</>)
}

export default Logout
