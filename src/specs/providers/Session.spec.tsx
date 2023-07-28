import {
  waitFor,
  act,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react'
import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import { sessionRender } from '../support/render'
import { useSession } from '../../hooks'
import { UsersController } from '../../controllers'

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

afterEach(() => {
  localStorage.clear()
  cleanup()
})

describe('SessionProvider', () => {
  test('without active session [mounted]', async () => {
    Spy.rejected(UsersController, 'signedUser')
    await act(async () => { sessionRender(<CustomApp />) })

    expect(screen.getByText(/Anonymous/)).toBeInTheDocument()
  })

  test('remember session', async () => {
    Spy.resolved(UsersController, 'signedUser', mockedUser)
    await act(async () => { sessionRender(<CustomApp />) })

    await waitFor(() => {
      expect(screen.queryByText(/Anonymous/)).toBeNull()
      expect(screen.queryByTestId('nickname')).not.toBeNull()
      expect(screen.queryByTestId('email')).not.toBeNull()
    })
  })

  test('&:login', async () => {
    Spy.rejected(UsersController, 'signedUser')
    await act(async () => { sessionRender(<CustomApp />) })

    expect(screen.getByText(/Anonymous/)).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Sign in/))
    await waitFor(() => {
      expect(screen.queryByText(/Anonymous/)).toBeNull()
      expect(screen.queryByTestId('nickname')).not.toBeNull()
      expect(screen.queryByTestId('email')).not.toBeNull()
    })
  })

  test(':logout', async () => {
    Spy.resolved(UsersController, 'signedUser', mockedUser)
    await act(async () => { sessionRender(<CustomApp />) })

    await waitFor(async () => {
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
