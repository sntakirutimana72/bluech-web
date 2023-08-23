import React from 'react'
import { Link } from 'react-router-dom'
import Form from './Form'
import type { SessionContext } from '../../../providers'

type Props = Pick<SessionContext, 'login'>

const Login = ({ login }: Props) => (
  <div className="session-pg login">
    <div className="session-logo">
      <img src="" alt="logo" />
    </div>
    <Form className="session-form login-form" login={login} />
    <Link to="/" className="forgot-password"><i>Forgot password?</i></Link>
    <div className="session-otherwise">
      <hr />
      <span>OR</span>
      <Link to="/users/register">Register</Link>
    </div>
  </div>
)

export default Login
