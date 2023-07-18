import React, { ButtonHTMLAttributes } from 'react'

type CustomButtonElement = ButtonHTMLAttributes<HTMLButtonElement>

type Props = React.HTMLProps<HTMLElement> & {
  title: string
  icon: string
  backBtn: CustomButtonElement & {
    url: string
    backIcon: string
  }
  optionsBtn: CustomButtonElement & {
    optIcon: string
  }
}

const NativeNavigation = (props: Props) => {
  const {
    title,
    icon,
    backBtn: { backIcon, url, ...backProps },
    optionsBtn: { optIcon, ...optionProps },
    ...selfProps
  } = props

  return (
    <nav {...selfProps}>
      <button aria-label={`Back To ${url}`} {...backProps}>
        <img src={backIcon} alt={url} />
      </button>
      <ul>
        <li>
          <img src={icon} alt={title} />
          <span>{title}</span>
        </li>
        <li>
          <button aria-label="options" {...optionProps}>
            <img src={optIcon} alt="options" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default NativeNavigation
