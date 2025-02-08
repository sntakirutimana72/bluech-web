import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from '@/config/routes'
import type { SessionContext } from '@/providers'
import AppLogo from '@/assets/logos/logo.png'
import { HeadBar } from '@/components/navs'
import Form from './Form'

type Props = Pick<SessionContext, 'login'>

const Login = ({ login }: Props) => (
  <div className="session-pg login">
    <HeadBar
      className="text-gradient"
      others={{
        text: process.env.REACT_APP_NAME!,
        src: AppLogo,
        sticker: 'Logo',
      }}
    />
    <Form className="session-form login-form" login={login} />
    <Link to={urls.LANDING} className="forgot-password">Forgot password?</Link>
    <div className="session-otherwise">
      <Link to={urls.REGISTER} className="text-gradient">Register</Link>
      <span>OR</span>
      <hr />
    </div>
  </div>
)

export default Login
