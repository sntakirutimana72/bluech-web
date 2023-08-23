import React from 'react'
import {
  MemoryRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import { act, screen } from '@testing-library/react'
import { TestCable } from '@anycable/core/testing'
import * as anycable from '@anycable/web'
import Spy from './support/mocks/spy'
import { appRender } from './support/render'
import Generic from './support/mocks/generic'
import SessionStore from '../store/session'
import { UsersController } from '../controllers'
import { InboxController } from '../controllers/v1'
import { useSession } from '../hooks'
import { RedirectedRoute, PrivateRoute } from '../middlewares'
import { Login, Logout, Register } from '../components/Session'
import GetStarted from '../components/GetStarted'
import Dashboard from '../components/Dashboard'
import Inbox from '../components/Inbox'
import People from '../components/People'
import ChatRoom from '../components/ChatRoom'
import NotFound from '../components/NotFound'

class CustomTestCable extends TestCable {
  // eslint-disable-next-line class-methods-use-this
  disconnect() {}
}

beforeEach(() => {
  Object.defineProperty(anycable, 'createCable', {
    writable: true,
    value: jest.fn().mockImplementation(() => new CustomTestCable()),
  })
})
afterEach(() => { localStorage.clear() })
afterAll(() => { Generic.resetAll() })

const App = ({ path = '/' }: { path?: string }) => {
  const { authenticated, logout, login } = useSession()

  return (
    <Router initialEntries={[path]}>
      <Routes>
        <Route element={<RedirectedRoute authenticated={authenticated} redirectTo="/dashboard" />}>
          <Route path="" element={<GetStarted />} />
          <Route path="users/register" element={<Register login={login} />} />
          <Route path="users/login" element={<Login login={login} />} />
        </Route>

        <Route element={<PrivateRoute authenticated={authenticated} redirectTo="/" />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<Inbox />} />
            <Route path="people" element={<People />} />
            <Route path="chats/:channelId" element={<ChatRoom />} />
          </Route>
          <Route path="users/logout" element={<Logout logout={logout} />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

describe('renders app', () => {
  describe('When no active session', () => {
    beforeEach(() => {
      Spy
        .agent(UsersController, 'signedUser')
        .mockImplementation(() => Promise.reject())
    })

    test('renders /', async () => {
      await act(async () => { appRender(<App />) })
      expect(screen.getByText(/Join Us/)).toBeInTheDocument()
    })

    test('/dashboard redirects to /', async () => {
      await act(async () => { appRender(<App path="/dashboard" />) })
      expect(screen.queryByTestId('app-name')).not.toBeInTheDocument()
      expect(screen.getByText(/Join Us/)).toBeInTheDocument()
    })
  })

  describe('With active session', () => {
    beforeEach(() => {
      SessionStore.persist('x-token')
      Spy
        .agent(UsersController, 'signedUser')
        .mockImplementation(() => Promise.resolve(Generic.currentUser()))
      Spy
        .agent(UsersController, 'people')
        .mockImplementation(() => Promise.reject())
      Spy
        .agent(InboxController, 'preview')
        .mockImplementation(() => Promise.reject())
    })

    test('renders /dashboard', async () => {
      await act(async () => { appRender(<App />) })
      expect(screen.queryByText(/Join Us/)).not.toBeInTheDocument()
    })

    test('/users/login redirects to /dashboard', async () => {
      await act(async () => { appRender(<App path="/users/login" />) })
      expect(screen.queryByRole('button', { description: 'Login' })).not.toBeInTheDocument()
    })
  })
})
