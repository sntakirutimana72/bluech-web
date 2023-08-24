import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react'
import Spy from '../../support/mocks/spy'
import Generic from '../../support/mocks/generic'
import { UsersController } from '../../../controllers'
import { Register } from '../../../components/Session'

const login = jest.fn()

afterEach(() => {
  localStorage.clear()
  login.mockClear()
  cleanup()
})
afterAll(() => {
  Generic.clear()
})

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<Register login={login} />} />
      <Route path="users/login" element={<div>Login Page</div>} />
    </Routes>
  </Router>
)

test('contains 2 text, 1 password & 1 submit inputs', () => {
  render(<Component />)
  expect(screen.getAllByRole('textbox')).toHaveLength(2)
  expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
})

test('displays errors occur while registering', async () => {
  Spy.rejected(UsersController, 'register', 'Oops!')

  render(<Component />)
  fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
  expect(await screen.findByText(/Oops!/)).toBeInTheDocument()
  expect(login).not.toHaveBeenCalled()
})

test('successful registration invokes login callback', async () => {
  const mockedUser = Generic.currentUser()
  Spy.resolved(UsersController, 'register', mockedUser)

  render(<Component />)
  fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
  await waitFor(() => { expect(login).toHaveBeenCalledWith(mockedUser) })
})

test('has link & redirects to /users/login', () => {
  render(<Component />)

  const link = screen.queryByRole('link', { name: 'Already have an account?' })
  expect(link).toBeInTheDocument()
  fireEvent.click(link!)
  expect(screen.getByText(/Login Page/)).toBeInTheDocument()
})
