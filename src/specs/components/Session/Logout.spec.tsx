import {
  MemoryRouter as Router,
  MemoryRouterProps,
  Routes,
  Route,
} from 'react-router-dom'
import { screen } from '@testing-library/react'
import { sessionRender, TestReduxStore } from '../../support/render'
import Generic from '../../support/mocks/generic'
import Spy from '../../support/mocks/spy'
import { useSession } from '../../../hooks'
import { PrivateRoute, RedirectedRoute } from '../../../middlewares'
import { Logout } from '../../../components/Session'
import { UsersController } from '../../../controllers'
import SessionStore from '../../../store/session'

const Component = (props: MemoryRouterProps) => {
  const { authenticated, logout } = useSession()
  return (
    <Router {...props}>
      <Routes>
        <Route element={<PrivateRoute redirectTo="public" authenticated={authenticated} />}>
          <Route path="users/logout" element={<Logout logout={logout} />} />
        </Route>
        <Route element={<RedirectedRoute redirectTo="/" authenticated={authenticated} />}>
          <Route path="public" element={<div>Get Started</div>} />
        </Route>
      </Routes>
    </Router>
  )
}

beforeEach(() => {
  SessionStore.persist('x-token')
  Spy.resolved(UsersController, 'signedUser', Generic.currentUser())
})
afterEach(() => {
  localStorage.clear()
  TestReduxStore.clear()
})
afterAll(() => {
  Generic.clear()
})

test('redirects to index after logging out', async () => {
  Spy.resolved(UsersController, 'logout')

  sessionRender(<Component initialEntries={['/users/logout']} />)
  expect(await screen.findByText(/Logging out../)).toBeInTheDocument()
  expect(await screen.findByText(/Get Started/)).toBeInTheDocument()
})
