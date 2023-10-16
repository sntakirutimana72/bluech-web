import { NavLink } from 'react-router-dom'
import { Home } from '@mui/icons-material'
import { urls } from '@/config/routes'

const NotFound = () => (
  <div className="not-found">
    <p>Not Found</p>
    <NavLink to={urls.HOME}>
      <Home />
      <span>Home</span>
    </NavLink>
  </div>
)

export default NotFound
