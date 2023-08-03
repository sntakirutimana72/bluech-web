import React from 'react'

export const Loader = ({ className = '', ...props }: Omit<React.HTMLProps<HTMLDivElement>, 'children'>) => (
  <div className={`loader ${className}`} {...props} data-testid="ball-loader">
    <div className="animate-load-ball-1" />
    <div className="animate-load-ball-2" />
    <div className="animate-load-ball-3" />
  </div>
)

export const LoaderOverlay = () => (
  <div className="flex h-screen px-12">
    <Loader className="h-full w-full" />
  </div>
)
