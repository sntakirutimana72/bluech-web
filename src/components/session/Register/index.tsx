import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from '@/config/routes'
import type { SessionContext } from '@/providers'
import AppLogo from '@/assets/logos/logo.png'
import { ButtonWithImg } from '@/components/elements/Buttons'
import Form from './Form'

type Props = Pick<SessionContext, 'login'>

const Register = ({ login }: Props) => (
  <div className="session-pg register">
    <nav>
      <ButtonWithImg className="text-gradient" text="bluech" src={AppLogo} sticker="Logo" />
    </nav>
    <Form className="session-form register-form" login={login} />
    <Link to={urls.LOGIN} className="already-have-acc">
      Already have an account?
    </Link>
  </div>
)

export default Register
