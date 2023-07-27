import { NavLink } from 'react-router-dom'
import { Person } from '@mui/icons-material'

type Props = {
  user: Personnel
}

const UserElement = ({ user }: Props) => (
  <NavLink to={`/dashboard/chats/${user.id}`} className="people-item" title={user.name}>
    <div className="people-item-avatar">
      {
          user.avatar
            ? <img src={user.avatar} alt={user.name} />
            : <Person />
        }
    </div>
    <div className="people-item-body">
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
    </div>
  </NavLink>
)

export default UserElement
