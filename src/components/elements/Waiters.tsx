import React from 'react'

type CustomProps = Omit<React.HTMLProps<HTMLDivElement>, 'children'>

export const BounceWaiter = ({ className = '', ...props }: CustomProps) => (
  <div className={`bounce-waiter ${className}`} {...props} data-testid="bounce-waiter">
    <div className="animate-wait-bouncer-1" />
    <div className="animate-wait-bouncer-2" />
    <div className="animate-wait-bouncer-3" />
  </div>
)

export const RolexWaiter = ({ className = '', ...props }: CustomProps) => (
  <div className={`rolex-waiter ${className}`} {...props}>
    <span className="animate-rolex-1" />
    <span className="animate-rolex-2" />
    <span className="animate-rolex-3" />
  </div>
)
