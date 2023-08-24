import {
  act,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react'
import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import { sessionRender, TestReduxStore } from '../support/render'
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
  TestReduxStore.clear()
  cleanup()
})
afterAll(() => {
  Generic.clear()
})

describe('SessionProvider', () => {
  test('renders without active session', async () => {
    Spy.rejected(UsersController, 'signedUser')
    await act(async () => { sessionRender(<CustomApp />) })

    expect(screen.getByText(/Anonymous/)).toBeInTheDocument()
  })

  test('remembers session', async () => {
    Spy.resolved(UsersController, 'signedUser', mockedUser)
    await act(async () => { sessionRender(<CustomApp />) })

    expect(screen.queryByText(/Anonymous/)).not.toBeInTheDocument()
    expect(screen.getByTestId('nickname')).toBeInTheDocument()
    expect(screen.getByTestId('email')).toBeInTheDocument()
  })

  test('reflects session after logging in', async () => {
    Spy.rejected(UsersController, 'signedUser')
    await act(async () => { sessionRender(<CustomApp />) })

    expect(screen.getByText(/Anonymous/)).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Sign in/))
    expect(screen.queryByText(/Anonymous/)).not.toBeInTheDocument()
    expect(screen.getByTestId('nickname')).toBeInTheDocument()
    expect(screen.getByTestId('email')).toBeInTheDocument()
  })

  test('re-renders after logging out', async () => {
    Spy.resolved(UsersController, 'signedUser', mockedUser)
    await act(async () => { sessionRender(<CustomApp />) })

    expect(screen.queryByText(/Anonymous/)).not.toBeInTheDocument()
    expect(screen.getByText(mockedUser.email)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/Logout/))

    expect(screen.queryByText(mockedUser.email)).not.toBeInTheDocument()
    expect(screen.getByText(/Anonymous/)).toBeInTheDocument()
  })
})
