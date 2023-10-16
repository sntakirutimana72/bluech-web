import {
  act,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { useSession } from '@/hooks'
import { UsersController } from '@/controllers'
import { sessionRender, TestReduxStore } from '#test-support/render'
import Spy from '#test-support/mocks/spy'
import Generic from '#test-support/mocks/generic'

const mockedUser = Generic.currentUser()

const CustomApp = () => {
  const {
    authenticated,
    currentUser,
    login,
    logout,
  } = useSession()
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
      <button type="button" onClick={() => login(mockedUser)}>Sign in</button>
      <button type="button" onClick={() => logout()}>Logout</button>
    </>
  )
}

describe('<SessionProvider />', () => {
  afterEach(() => {
    localStorage.clear()
    TestReduxStore.clear()
  })

  afterAll(() => Generic.clear())

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

  describe('Auto Refresh Timer', () => {
    const originalEnv = process.env

    beforeEach(() => {
      process.env = {
        ...originalEnv,
        REACT_APP_SESSION_AUTO_REFRESH_TIME: '3000',
      }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    test('session refresh failure', async () => {
      const { email } = mockedUser
      Spy.resolved(UsersController, 'signedUser', mockedUser)
      Spy.rejected(UsersController, 'refresh')

      await act(async () => { sessionRender(<CustomApp />) })
      expect(screen.queryByText(/Anonymous/)).not.toBeInTheDocument()
      expect(screen.getByText(email)).toBeInTheDocument()
      await waitForElementToBeRemoved(() => screen.queryByText(email), { timeout: 3100 })
    })
  })
})
