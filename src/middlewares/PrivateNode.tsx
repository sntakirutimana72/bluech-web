import React from 'react';
import { Outlet } from 'react-router-dom';
import type { SessionContext } from '../providers';

type Props = Pick<SessionContext, 'authenticated'> & {
  children: React.ReactNode
}

const PrivateNode = ({ authenticated, children }: Props) => (
  authenticated ? (children || <Outlet />) : null
);

export default PrivateNode;
