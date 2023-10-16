import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import {
  render,
  waitFor,
  screen,
  fireEvent,
} from '@testing-library/react'
import { Login } from 'src/components/session'
import { UsersController } from '@/controllers'
import routes from '@/config/routes'
import Spy from '#test-support/mocks/spy'
import Generic from '#test-support/mocks/generic'

const login = jest.fn()

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<Login login={login} />} />
      <Route path={routes.LOGIN} element={<div>Register Page</div>} />
    </Routes>
  </Router>
)

describe('<Login />', () => {
  afterEach(() => {
    localStorage.clear()
    login.mockClear()
  })

  afterAll(() => Generic.clear())

  test('contains 1 text, 1 password & 1 submit inputs', () => {
    render(<Component />)
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
    expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  test('displays errors occur while logging in', async () => {
    Spy.rejected(UsersController, 'login', 'Oops!')

    render(<Component />)
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText(/Oops!/)).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  test('successful sign-in invokes login callback', async () => {
    const mockedUser = Generic.currentUser()
    Spy.resolved(UsersController, 'login', mockedUser)

    render(<Component />)
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => { expect(login).toHaveBeenCalledWith(mockedUser) })
  })

  test('contains links', () => {
    render(<Component />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})
