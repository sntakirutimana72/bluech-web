import React from 'react'
import {
  act,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import Spy from './support/mocks/spy'
import { appRender } from './support/render'
import Generic from './support/mocks/generic'
import App from '../App'
import SessionStore from '../store/session'
import { UsersController } from '../controllers'

afterEach(() => {
  localStorage.clear()
})

const CustomApp = () => (
  <>
    <App />
    <a href="/dashboard" data-testid="goToHome">goToHome</a>
    <a href="/users/login" data-testid="goToLogin">goToLogin</a>
  </>
)

describe('renders app', () => {
  describe('When no active session', () => {
    beforeEach(() => {
      Spy.rejected(UsersController, 'signedUser')
    })

    test('renders /', async () => {
      act(() => { appRender(<App />) })
      await waitFor(() => {
        expect(screen.queryByText(/Join Us/)).toBeTruthy()
      })
    })

    test('/dashboard redirects to /', async () => {
      act(() => { appRender(<CustomApp />) })
      await waitFor(() => {
        expect(screen.queryByText(/Join Us/)).toBeTruthy()
      })
      fireEvent.click(screen.getByTestId('goToHome'))
      await waitFor(() => {
        expect(screen.queryByTestId('app-name')).toBeNull()
        expect(screen.queryByText(/Join Us/)).toBeTruthy()
      })
    })
  })

  describe('With active session', () => {
    beforeEach(() => {
      SessionStore.persist('x-token')
      Spy.resolved(UsersController, 'signedUser', Generic.currentUser())
    })

    test('renders /dashboard', async () => {
      act(() => { appRender(<App />) })
      await waitFor(() => {
        expect(screen.queryByText(/Join Us/)).toBeNull()
      })
    })

    test('/users/login redirects to /dashboard', async () => {
      act(() => { appRender(<CustomApp />) })
      await waitFor(() => {
        expect(screen.queryByText(/Join Us/)).toBeNull()
      })
      fireEvent.click(screen.getByTestId('goToLogin'))
      await waitFor(() => {
        expect(screen.queryByRole('button', { description: 'Login' })).toBeNull()
      })
    })
  })
})
