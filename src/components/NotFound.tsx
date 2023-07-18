import  { NavLink } from "react-router-dom"
import { Home } from '@mui/icons-material'

const NotFound = () => (
  <div className="not-found">
    <p>Not Found</p>
    <NavLink to="/dashboard">
      <Home />
      <span>Home</span>
    </NavLink>
  </div>
)

export default NotFound
