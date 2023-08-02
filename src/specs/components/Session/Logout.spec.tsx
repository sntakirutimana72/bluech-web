import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom'
import {
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react'
import { sessionRender } from '../../support/render'
import Generic from '../../support/mocks/generic'
import Spy from '../../support/mocks/spy'
import { useSession } from '../../../hooks'
import { PrivateRoute, RedirectedRoute } from '../../../middlewares'
import { Logout } from '../../../components/Session'
import { UsersController } from '../../../controllers'
import SessionStore from '../../../store/session'

const Component = () => {
  const { authenticated, logout } = useSession()
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute redirectTo="public" authenticated={authenticated} />}>
          <Route index element={<NavLink to="/users/logout">Logout</NavLink>} />
          <Route path="users/logout" element={<Logout logout={logout} />} />
        </Route>
        <Route element={<RedirectedRoute redirectTo="/" authenticated={authenticated} />}>
          <Route path="public" element={<div>Get Started</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

beforeEach(() => {
  SessionStore.persist('x-token')
  Spy.resolved(UsersController, 'signedUser', Generic.currentUser())
})

afterEach(() => { localStorage.clear() })

describe('Logout', () => {
  test('renders index', async () => {
    act(() => { sessionRender(<Component />) })
    await waitFor(() => {
      expect(screen.queryByText(/Get Started/)).toBeFalsy()
      expect(screen.queryByRole('link', { name: 'Logout' })).toBeTruthy()
    })
  })

  test('redirects to Logout page', async () => {
    Spy.resolved(UsersController, 'logout')
    act(() => { sessionRender(<Component />) })
    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Logout' })).toBeTruthy()
    })
    act(() => {
      fireEvent.click(screen.getByRole('link', { name: 'Logout' }))
    })
    expect(screen.queryByText(/Logging out../)).toBeTruthy()
    await waitFor(() => {
      expect(screen.queryByText(/Get Started/)).toBeTruthy()
    })
  })
})
