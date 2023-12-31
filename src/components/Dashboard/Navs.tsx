import React, { useState } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import {
  Logout,
  ManageAccounts,
  Inbox,
  People,
  Search,
} from '@mui/icons-material'
import { urls } from '@/config/routes'
import { uid } from 'uid'

type Props = { currentUser: CurrentUser }

export const TopNav = ({ currentUser }: Props) => {
  const [toggled, setToggled] = useState(false)

  const toggleToolbar = () => {
    setToggled((prevState) => !prevState)
  }

  return (
    <nav className="top-nav desktop-top-nav">
      <NavLink to={urls.HOME} className="nav-logo">
        <span data-testid="app-name">bluech</span>
      </NavLink>
      <button type="button" onClick={toggleToolbar} className={toggled ? 'open' : undefined}>
        <span />
        <span />
        <span />
      </button>
      <div className={`acc-options animate-toggled${toggled ? ' open' : ''}`}>
        <div className="container">
          <div>
            <img src="https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png" alt="avatar" />
            <span>{currentUser.name}</span>
            <span>{currentUser.email}</span>
          </div>
          <NavLink to="/users/account" className="acc-nav-item">
            <ManageAccounts />
            <span>Account</span>
          </NavLink>
          <NavLink to={urls.LOGOUT} className="acc-nav-item">
            <Logout />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

const BottomNavLink = ({ children, ...props }: NavLinkProps) => (
  <NavLink {...props} end>
    {children}
  </NavLink>
)

export const BottomNav = () => {
  const config = { className: 'bottom-nav-item' }
  return (
    <nav className="bottom-nav desktop-bottom-nav">
      {
        [
          {
            ...config, title: 'Chats', to: urls.HOME, children: <Inbox />,
          },
          {
            ...config, title: 'People', to: urls.PEOPLE, children: <People />,
          },
        ].map((props) => <BottomNavLink {...props} key={uid()} />)
      }
      <button
        type="button"
        className="bottom-nav-item search-btn"
        title="Search"
        onClick={() => {}}
      >
        <Search />
      </button>
    </nav>
  )
}
