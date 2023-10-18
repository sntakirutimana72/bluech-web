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

export interface ButtonWithImgProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  text: string | null
  src: string
  sticker: string
}

export const ButtonWithImg = ({
  text,
  src,
  sticker,
  ...props
}: ButtonWithImgProps) => (
  <button type="button" {...props}>
    <img src={src} alt={sticker} />
    {text}
  </button>
)
