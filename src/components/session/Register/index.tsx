import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from '@/config/routes'
import type { SessionContext } from '@/providers'
import AppLogo from '@/assets/logos/logo.png'
import { HeadBar } from '@/components/navs'
import Form from './Form'

type Props = Pick<SessionContext, 'login'>

const Register = ({ login }: Props) => (
  <div className="session-pg register">
    <HeadBar
      className="text-gradient"
      others={{
        text: process.env.REACT_APP_NAME!,
        src: AppLogo,
        sticker: 'Logo',
      }}
    />
    <Form className="session-form register-form" login={login} />
    <Link to={urls.LOGIN} className="already-have-acc">
      Already have an account?
    </Link>
  </div>
)

export default Register
