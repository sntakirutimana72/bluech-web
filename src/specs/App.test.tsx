import React from 'react';
import {
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { cableLessRender, appRender } from './support/render';
import Generic from './support/mocks/generic'
import AxiosMocker from './support/mocks/axios'
import App from '../App';
import SessionStore from '../store/session'

afterEach(() => {
  cleanup()
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
    test('renders /', async () => {
      cableLessRender(<App />)

      await waitFor(() => {
        expect(screen.queryByText(/Join Us/)).toBeTruthy()
      })
    })

    test('/dashboard redirects to /', async () => {
      cableLessRender(<CustomApp />)

      await waitFor(() => {
        expect(screen.queryByText(/Join Us/)).toBeTruthy()
      })
      fireEvent.click(screen.getByTestId('goToHome'))
      await waitFor(() => {
        expect(screen.queryByTestId('app-name')).toBeNull()
        expect(screen.queryByText(/Join Us/)).toBeTruthy()
      });
    })
  })

  describe('With active session', () => {
    beforeEach(() => {
      SessionStore.persist('SOME_AUTH_X_TOKEN')
      AxiosMocker.resolved('get', {
        status: 200,
        headers: { authorization: 'SOME_AUTH_X_TOKEN' },
        data: { user: Generic.currentUser() },
      })
    })

    test('renders /dashboard', async () => {
      cableLessRender(<CustomApp />)

      await waitFor(() => {
        expect(screen.queryByText(/Join Us/)).toBeNull()
      })
    })

    test('/users/login redirects to /dashboard', async () => {
      appRender(<CustomApp />)

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
