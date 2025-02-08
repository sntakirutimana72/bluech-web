import React, { useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { Logout, ManageAccounts } from '@mui/icons-material'
import { urls } from '@/config/routes'
import AppLogo from '@/assets/logos/logo.png'
import HeadBar from './HeadBar'

type TitleBarProps = { currentUser: CurrentUser }
type AccountOptionsProps = TitleBarProps & {
  isOpen: boolean
}

const AccountOptions = ({ isOpen, currentUser }: AccountOptionsProps) => (
  <div className={`acc-options animate-toggled${isOpen ? ' open' : ''}`}>
    <div className="acc-options-container">
      <img
        src="https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png"
        className="acc-options-img"
        alt="avatar"
      />
      <p className="acc-options-body">
        <span>{currentUser.name}</span>
        <span>{currentUser.email}</span>
      </p>
      <NavLink to={urls.ACCOUNT} className="acc-options-item">
        <ManageAccounts />
        <span>Account</span>
      </NavLink>
      <NavLink to={urls.LOGOUT} className="acc-options-item">
        <Logout />
        <span>Logout</span>
      </NavLink>
    </div>
  </div>
)

export default function TitleBar({ currentUser }: TitleBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAccountOptions = useCallback(() => {
    setIsOpen((prevState) => !prevState)
  }, [])

  return (
    <HeadBar
      className="titlebar"
      others={{
        src: AppLogo,
        text: process.env.REACT_APP_NAME!,
        sticker: 'Logo',
        className: 'text-gradient titlebar-logo',
        onClick: toggleAccountOptions,
      }}
    >
      <AccountOptions currentUser={currentUser} isOpen={isOpen} />
    </HeadBar>
  )
}
