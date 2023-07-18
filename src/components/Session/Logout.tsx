import { useEffect } from 'react';
import type { SessionContext } from '../../providers';
import { SessionController } from '../../controllers';

type Props = Pick<SessionContext, 'logout'>

const Logout = ({ logout }: Props) => {
  useEffect(() => { SessionController.logout().then(logout); });

  return (<>Logging out..</>);
};

export default Logout;
