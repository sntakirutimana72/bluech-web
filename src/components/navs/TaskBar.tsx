import React from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import {
  Home, Chat, People, Search,
} from '@mui/icons-material'
import { uid } from 'uid'
import { urls } from '@/config/routes'

type NavLinkChildProps = {
  icon: React.ReactNode
  text: string | null
}

type TaskBarLinkProps = Omit<NavLinkProps, 'children'> & NavLinkChildProps

const NavLinkChild = ({ icon, text }: NavLinkChildProps) => (
  <label>
    {icon}
    {text}
  </label>
)

const TaskBarLink = ({ icon, text, ...props }: TaskBarLinkProps) => (
  <NavLink {...props}>
    <NavLinkChild icon={icon} text={text} />
  </NavLink>
)

export default function TaskBar() {
  const className = 'taskbar-link'
  const items = [
    { icon: <Home />, text: 'Home', to: urls.HOME },
    { icon: <Chat />, text: 'Chats', to: urls.LOGIN },
    { icon: <People />, text: 'People', to: urls.PEOPLE },
    { icon: <Search />, text: 'Search', to: urls.SEARCH },
  ]
  return (
    <nav className="taskbar">
      {
        items.map((prop) => (
          <TaskBarLink key={uid()} className={className} {...prop} />
        ))
      }
    </nav>
  )
}
