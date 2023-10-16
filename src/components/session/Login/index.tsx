import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from '@/config/routes'
import type { SessionContext } from '@/providers'
import Form from './Form'

type Props = Pick<SessionContext, 'login'>

const Login = ({ login }: Props) => (
  <div className="session-pg login">
    <div className="session-logo">
      <img src="" alt="logo" />
    </div>
    <Form className="session-form login-form" login={login} />
    <Link to={urls.LANDING} className="forgot-password"><i>Forgot password?</i></Link>
    <div className="session-otherwise">
      <hr />
      <span>OR</span>
      <Link to={urls.REGISTER}>Register</Link>
    </div>
  </div>
)

export default Login
