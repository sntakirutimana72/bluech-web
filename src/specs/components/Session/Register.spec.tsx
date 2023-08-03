import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react'
import Spy from '../../support/mocks/spy'
import Generic from '../../support/mocks/generic'
import { Register } from '../../../components/Session'
import { UsersController } from '../../../controllers'

const login = jest.fn()

afterEach(() => {
  login.mockClear()
  cleanup()
})

const Component = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<Register login={login} />} />
      <Route path="users/login" element={<div>Login Page</div>} />
    </Routes>
  </BrowserRouter>
)

test('contains 3 text & 1 submit inputs', () => {
  render(<Component />)
  expect(screen.getAllByRole('textbox')).toHaveLength(2)
  expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
})

test('displays errors occur while registering', async () => {
  Spy.rejected(UsersController, 'register', 'Oops!')
  render(<Component />)

  const signupButton = screen.getByRole('button', { name: 'Sign up' })
  fireEvent.click(signupButton)
  await waitFor(() => {
    expect(screen.queryByText(/Oops!/)).toBeTruthy()
  })
  expect(login).not.toHaveBeenCalled()
})

test('successful registration invokes login', async () => {
  Spy.resolved(UsersController, 'register', Generic.currentUser())
  render(<Component />)

  fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
  await waitFor(() => {
    expect(login).toHaveBeenCalled()
  })
})

test('has link & redirects to /users/login', () => {
  render(<Component />)

  const link = screen.queryByRole('link')
  expect(link).toBeTruthy()
  fireEvent.click(link!)
  expect(screen.getByText(/Login Page/)).toBeInTheDocument()
})
