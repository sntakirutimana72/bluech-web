import { HTMLAttributes } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import { Refresh } from '@mui/icons-material'

export interface RefreshButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export const RefreshButton = ({ children, ...props }: RefreshButtonProps) => (
  <button type="button" aria-label="Refresh" {...props}>
    {
      children || <Refresh />
    }
  </button>
)

type ImageBtnProps = {
  text: string | null
  src: string
  sticker: string
}

export type ButtonImageProps = Omit<HTMLAttributes<HTMLButtonElement>, 'children'> & ImageBtnProps

export const ButtonImage = ({
  text,
  src,
  sticker,
  ...props
}: ButtonImageProps) => (
  <button type="button" {...props}>
    <img src={src} alt={sticker} />
    {text}
  </button>
)

export type AppLogoBtnProps = Omit<NavLinkProps, 'children'> & ButtonImageProps

export const AppLogoLink = ({
  text,
  src,
  sticker,
  ...props
}: AppLogoBtnProps) => (
  <NavLink {...props}>
    <img src={src} alt={sticker} />
    {text}
  </NavLink>
)
