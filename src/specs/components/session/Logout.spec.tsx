import {
  MemoryRouter as Router,
  Routes,
  Route,
  NavLink,
  MemoryRouterProps,
} from 'react-router-dom'
import { screen, act, fireEvent } from '@testing-library/react'
import { useSession } from '@/hooks'
import { PrivateRoute, PublicRoute } from '@/middlewares'
import { Logout } from 'src/components/session'
import { UsersController } from '@/controllers'
import SessionStore from '@/store/session'
import routes, { urls } from '@/config/routes'
import { sessionRender, TestReduxStore } from '#test-support/render'
import Generic from '#test-support/mocks/generic'
import Spy from '#test-support/mocks/spy'

const Component = (props: MemoryRouterProps) => {
  const { authenticated, logout } = useSession()
  return (
    <Router {...props}>
      <Routes>
        <Route element={<PrivateRoute redirectTo={urls.LANDING} authenticated={authenticated} />}>
          <Route path={routes.home.INDEX} element={<NavLink to={urls.LOGOUT}>Logout</NavLink>} />
          <Route path={routes.LOGOUT} element={<Logout logout={logout} />} />
        </Route>
        <Route element={<PublicRoute redirectTo={urls.HOME} authenticated={authenticated} />}>
          <Route path={routes.LANDING} element={<div>Get Started</div>} />
        </Route>
      </Routes>
    </Router>
  )
}

describe('<Logout />', () => {
  beforeEach(() => {
    SessionStore.persist('x-token')
    Spy.resolved(UsersController, 'signedUser', Generic.currentUser())
  })

  afterEach(() => {
    localStorage.clear()
    TestReduxStore.clear()
  })

  afterAll(() => Generic.clear())

  test('Logout redirects to Landing Page', async () => {
    Spy.resolved(UsersController, 'logout')

    await act(async () => {
      sessionRender(<Component initialEntries={[urls.LOGOUT]} />)
    })
    const logoutButton = screen.queryByRole('link', { name: 'Logout' })
    expect(logoutButton).toBeInTheDocument()
    await act(async () => fireEvent.click(logoutButton!))
    expect(screen.getByText(/Get Started/)).toBeInTheDocument()
  })
})
