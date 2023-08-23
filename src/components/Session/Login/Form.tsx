import React, { useState } from 'react'
import type { SessionContext } from '../../../providers'
import { UsersController } from '../../../controllers'
import { Text } from '../../Elements'

type Props = React.HTMLProps<HTMLFormElement> & Pick<SessionContext, 'login'>
type CustomFormElement = HTMLFormElement & {
  readonly elements: HTMLFormControlsCollection & {
    email: HTMLInputElement
    password: HTMLInputElement
  }
}

const Form = ({ login, ...props }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string>()

  const handleSubmit = (event: React.FormEvent<CustomFormElement>) => {
    event.preventDefault()
    UsersController
      .login({ email, password })
      .then(login, (err) => { setErrors(err) })
  }

  return (
    <form onSubmit={handleSubmit} {...props}>
      <h1 className="text-gradient">Login</h1>
      {
        errors && <div>{errors}</div>
      }
      <Text
        label={{ val: 'Email', htmlFor: 'email' }}
        input={{
          type: 'text',
          id: 'email',
          name: 'email',
          value: email,
          onChange: (e) => { setEmail(e.currentTarget.value) },
          placeholder: 'Email',
          required: true,
        }}
      />
      <Text
        label={{ val: 'Password', htmlFor: 'password' }}
        input={{
          type: 'password',
          id: 'password',
          name: 'password',
          value: password,
          onChange: (e) => { setPassword(e.currentTarget.value) },
          placeholder: 'Password',
          required: true,
        }}
      />
      <div className="checkbox">
        <input type="checkbox" id="rememberable" name="rememberable" />
        <label htmlFor="rememberable">Remember me</label>
      </div>
      <input type="submit" className="btn submit-btn" value="Sign in" />
    </form>
  )
}

export default Form
