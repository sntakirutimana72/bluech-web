import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { Person } from '@mui/icons-material'
import { urls } from '@/config/routes'
import { ListItemProps } from '@/components/elements/Lists'

export type UserListItemProps = ListItemProps & Personnel

const UserElement = ({
  id,
  name,
  bio,
  avatar,
}: UserListItemProps) => (
  <li title={name}>
    <NavLink to={urls.chatroom(id)} className="people-item">
      <div className="people-item-avatar">
        {avatar ? <img src={avatar} alt={name} /> : <Person />}
      </div>
      <div className="people-item-body">
        <h3>{name}</h3>
        <p>{bio}</p>
      </div>
    </NavLink>
  </li>
)

export default memo(UserElement)
