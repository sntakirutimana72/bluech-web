import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from '@/config/routes'
import type { SessionContext } from '@/providers'
import Form from './Form'

type Props = Pick<SessionContext, 'login'>

const Register = ({ login }: Props) => (
  <div className="session-pg register">
    <div className="session-logo">
      <img src="" alt="logo" />
    </div>
    <Form className="session-form register-form" login={login} />
    <Link to={urls.LOGIN} className="already-have-acc">
      <i>Already have an account?</i>
    </Link>
  </div>
)

export default Register
