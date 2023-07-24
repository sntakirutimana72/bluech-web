import AxiosMocker from '../support/mocks/axios'
import Generic from '../support/mocks/generic'
import SessionStore from '../../store/session'
import { SessionController } from '../../controllers'

afterEach(() => {
  localStorage.clear()
})

describe('SessionController', () => {
  const mockedUser = Generic.currentUser()

  describe('#login( credentials )', () => {
    const credentials = { email: '', password: '' }

    test('[resolved]', async () => {
      AxiosMocker.resolved('post', {
        data: { user: mockedUser },
        status: 200,
        headers: { authorization: 'SOME_AUTH_X_HEADER' },
      })
      expect(SessionStore.fetch()).toBeNull()
      expect(await SessionController.login(credentials)).toEqual(mockedUser)
      expect(SessionStore.fetch()).not.toBeNull()
    })

    test('[rejected]', async () => {
      AxiosMocker.rejected('post', {
        message: 'Unauthorized',
        status: 401,
      })
      try {
        await SessionController.login(credentials)
      } catch (exc) {
        expect(exc).toBe('Unauthorized')
        expect(SessionStore.fetch()).toBeNull()
      }
    })
  })

  describe('#logout()', () => {
    beforeEach(() => {
      SessionStore.persist('SOME_AUTH_TOKEN')
    })

    test('successfully logs out on server', async () => {
      expect(SessionStore.fetch()).not.toBeNull()
      AxiosMocker.resolved('delete', { status: 200 })
      await SessionController.logout()
      expect(SessionStore.fetch()).toBeNull()
    })

    test('fails to log out on server', async () => {
      expect(SessionStore.fetch()).not.toBeNull()
      AxiosMocker.rejected('delete', { status: 500 })
      try {
        await SessionController.logout()
      } catch {
        expect(SessionStore.fetch()).toBeNull()
      }
    })
  })

  describe('#register( requirements ) ', () => {
    test('[resolved]', async () => {
      AxiosMocker.resolved('post', {
        status: 201,
        headers: { authorization: 'SOME_AUTH_TOKEN' },
        data: { user: mockedUser },
      })
      expect(SessionStore.fetch()).toBeNull()
      expect(await SessionController.register(Generic.newUser())).toEqual(mockedUser)
      expect(SessionStore.fetch()).not.toBeNull()
    })

    test('[rejected]', async () => {
      AxiosMocker.rejected('post', {
        status: 402,
        message: 'unprocessable entity',
      })
      try {
        await SessionController.register(Generic.newUser())
      } catch (exc) {
        expect(SessionStore.fetch()).toBeNull()
        expect(exc).toBe('unprocessable entity')
      }
    })
  })

  describe('#signedUser()', () => {
    test('[resolved]', async () => {
      SessionStore.persist('SOME_AUTH_TOKEN')
      AxiosMocker.resolved('get', {
        status: 200,
        headers: { authorization: 'SOME_NEW_AUTH_TOKEN' },
        data: { user: mockedUser },
      })
      expect(await SessionController.signedUser()).toEqual(mockedUser)
      expect(SessionStore.fetch()).toBe('SOME_NEW_AUTH_TOKEN')
    })

    test('[rejected]', async () => {
      SessionStore.persist('SOME_AUTH_TOKEN')
      AxiosMocker.rejected('get', { status: 401 })

      try {
        await SessionController.signedUser()
      } catch {
        expect(SessionStore.fetch()).toBeNull()
      }
    })

    test('when ensureAuthorizationExists() fails', () => {
      SessionController
        .signedUser()
        .then(() => { throw new Error('Failure') })
        .catch(() => {})
    })
  })

  describe('#refresh()', () => {
    test('[resolved]', async () => {
      AxiosMocker.resolved('head', {
        status: 200,
        headers: { authorization: 'SOME_NEW_AUTH_TOKEN' },
      })
      SessionStore.persist('SOME_AUTH_TOKEN')
      await SessionController.refresh()
      expect(SessionStore.fetch()).toBe('SOME_NEW_AUTH_TOKEN')
    })

    test('[rejected]', async () => {
      SessionStore.persist('SOME_AUTH_TOKEN')
      AxiosMocker.rejected('head', { status: 401 })

      try {
        await SessionController.refresh()
      } catch {
        expect(SessionStore.fetch()).toBeNull()
      }
    })

    test('when ensureAuthorizationExists() fails', () => {
      SessionController
        .refresh()
        .then(() => { throw new Error('Failure') })
        .catch(() => {})
    })
  })
})
