import {
  waitFor,
  screen,
  fireEvent,
} from '@testing-library/react'
import AxiosMocker from '../support/mocks/axios'
import Generic from '../support/mocks/generic'
import { sessionRender } from '../support/render'
import { useSession } from '../../hooks'

afterEach(() => {
  localStorage.clear()
})

const mockedUser = Generic.currentUser()

const CustomApp = () => {
  const {
    authenticated,
    currentUser,
    login,
    logout,
  } = useSession()

  const onLogin = () => {
    login(mockedUser)
  }

  const onLogout = () => { logout() }

  return (
    <>
      { authenticated === false && <span>Anonymous</span> }
      {
        currentUser && (
          <div>
            <span data-testid="nickname">{ currentUser.name }</span>
            <span data-testid="email">{ currentUser.email }</span>
          </div>
        )
      }
      <button type="button" onClick={onLogin}>Sign in</button>
      <button type="button" onClick={onLogout}>Logout</button>
    </>
  )
}

describe('SessionProvider', () => {
  test('without active session [mounted]', async () => {
    AxiosMocker.resolved('get', { data: '', status: 401 })
    sessionRender(<CustomApp />)

    await waitFor(() => {
      expect(screen.getByText(/Anonymous/)).not.toBeNull()
    })
  })

  test('remember session', async () => {
    AxiosMocker.resolved('get', {
      data: { user: mockedUser },
      status: 200,
      headers: { authorization: 'SOME_AUTH_X_TOKEN' },
    })
    sessionRender(<CustomApp />)

    await waitFor(() => {
      expect(screen.queryByText(/Anonymous/)).toBeNull()
      expect(screen.queryByTestId('nickname')).not.toBeNull()
      expect(screen.queryByTestId('email')).not.toBeNull()
    })
  })

  test('&:login', async () => {
    AxiosMocker.resolved('get', { data: '', status: 401 })
    sessionRender(<CustomApp />)

    await waitFor(() => {
      expect(screen.queryByText(/Anonymous/)).not.toBeNull()
    })

    fireEvent.click(screen.getByText(/Sign in/))

    await waitFor(() => {
      expect(screen.queryByText(/Anonymous/)).toBeNull()
      expect(screen.queryByTestId('nickname')).not.toBeNull()
      expect(screen.queryByTestId('email')).not.toBeNull()
    })
  })

  test(':logout', async () => {
    AxiosMocker.resolved('get', {
      data: { user: mockedUser },
      status: 200,
      headers: { authorization: 'SOME_AUTH_X_TOKEN' },
    })
    sessionRender(<CustomApp />)

    await waitFor(() => {
      expect(screen.queryByText(/Anonymous/)).toBeNull()
      expect(screen.queryByText(mockedUser.email)).not.toBeNull()
    })

    fireEvent.click(screen.getByText(/Logout/))

    await waitFor(() => {
      expect(screen.queryByText(/Anonymous/)).not.toBeNull()
      expect(screen.queryByText(mockedUser.email)).toBeNull()
    })
  })
})
