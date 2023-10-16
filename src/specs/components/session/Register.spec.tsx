import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import { UsersController } from '@/controllers'
import { Register } from 'src/components/session'
import routes from '@/config/routes'
import Spy from '#test-support/mocks/spy'
import Generic from '#test-support/mocks/generic'

const login = jest.fn()

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<Register login={login} />} />
      <Route path={routes.LOGIN} element={<div>Login Page</div>} />
    </Routes>
  </Router>
)

describe('<Register />', () => {
  afterEach(() => {
    localStorage.clear()
    login.mockClear()
  })

  afterAll(() => Generic.clear())

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
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(mockedUser)
    })
  })

  test('has link & redirects to /users/login', () => {
    render(<Component />)

    const link = screen.queryByRole('link', { name: 'Already have an account?' })
    expect(link).toBeInTheDocument()
    fireEvent.click(link!)
    expect(screen.getByText(/Login Page/)).toBeInTheDocument()
  })
})
