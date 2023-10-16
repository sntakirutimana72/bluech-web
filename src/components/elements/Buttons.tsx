import { HTMLAttributes } from 'react'
import { Refresh } from '@mui/icons-material'

export interface RefreshButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export const RefreshButton = ({ children, ...props }: RefreshButtonProps) => (
  <button type="button" aria-label="Refresh" {...props}>
    {
      children || <Refresh />
    }
  </button>
)
