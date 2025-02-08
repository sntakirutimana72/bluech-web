import React, { HTMLAttributes } from 'react'
import { ButtonImage, AppLogoLink } from '@/components/elements/Buttons'
import type { AppLogoBtnProps, ButtonImageProps } from '@/components/elements/Buttons'

type HeadBarProps = Pick<HTMLAttributes<HTMLElement>, 'className' | 'children'> & {
  hasLink?: boolean
  others: AppLogoBtnProps | ButtonImageProps
}

export default function HeadBar({
  hasLink,
  others,
  children,
  ...props
}: HeadBarProps) {
  return (
    <nav {...props}>
      {
        hasLink ? <AppLogoLink {...others as AppLogoBtnProps} /> : <ButtonImage {...others} />
      }
      {children}
    </nav>
  )
}
