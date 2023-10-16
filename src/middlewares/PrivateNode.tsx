import React, { memo } from 'react'
import type { SessionContext } from '@/providers'

type Props = Pick<SessionContext, 'authenticated'> & {
  children: React.ReactNode
}

const PrivateNode = ({ authenticated, children }: Props) => (
  <>
    <i className="opacity-0 hidden" aria-label="PrivateNode Placeholder" />
    { authenticated && children }
  </>
)

export default memo(PrivateNode)
