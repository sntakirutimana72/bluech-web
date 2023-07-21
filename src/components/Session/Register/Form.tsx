import React, { useState } from 'react'
import type { SessionContext } from '../../../providers'
import { SessionController } from '../../../controllers'
import { Text } from '../../Elements'

type Props = React.HTMLProps<HTMLFormElement> & Pick<SessionContext, 'login'>
type CustomFormElement = HTMLFormElement & {
  readonly elements: HTMLFormControlsCollection & {
    name: HTMLInputElement
    email: HTMLInputElement
    password: HTMLInputElement
  }
}

const Form = ({ login, ...props }: Props) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string>()

  const handleSubmit = (event: React.FormEvent<CustomFormElement>) => {
    event.preventDefault()
    SessionController
      .register({ name, email, password })
      .then(login, (err) => { setErrors(err) })
  }

  return (
    <form onSubmit={handleSubmit} {...props}>
      <h1 className="text-gradient">Sign up</h1>
      {
        errors && <div>{errors}</div>
      }
      <Text
        label={{ val: 'Name', htmlFor: 'nickname' }}
        input={{
          type: 'text',
          id: 'nickname',
          name: 'nickname',
          value: name,
          onChange: (e) => { setName(e.currentTarget.value) },
          placeholder: 'Name',
          required: true,
        }}
      />
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
      <input type="submit" className="btn submit-btn" value="Sign up" />
    </form>
  )
}

export default Form
