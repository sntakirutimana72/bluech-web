import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from '@/config/routes'
import type { SessionContext } from '@/providers'
import AppLogo from '@/assets/logos/logo.png'
import { ButtonWithImg } from '@/components/elements/Buttons'
import Form from './Form'

type Props = Pick<SessionContext, 'login'>

const Login = ({ login }: Props) => (
  <div className="session-pg login">
    <nav>
      <ButtonWithImg className="text-gradient" text="bluech" src={AppLogo} sticker="Logo" />
    </nav>
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
