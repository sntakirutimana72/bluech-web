import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import SessionStore from '../../store/session'
import { Axios } from '../../helpers/requests'
import { UsersController } from '../../controllers'

afterEach(() => { localStorage.clear() })
afterAll(() => { Generic.resetAll() })

describe('UsersController', () => {
  const mockedUser = Generic.currentUser()

  describe('#people( page )', () => {
    test('[resolved]', async () => {
      const mockedPeople: People = {
        people: [Generic.personnel()], pagination: Generic.paginate(),
      }
      Spy.resolved(Axios, 'get', { data: mockedPeople, status: 200 })
      expect(await UsersController.people(1)).toEqual(mockedPeople)
    })

    test('[rejected]', async () => {
      Spy.rejected(Axios, 'get', { message: 'Unauthorized', status: 401 })
      try {
        await UsersController.people(1)
      } catch (exc) {
        expect(exc).toBe('Unauthorized')
      }
    })
  })

  describe('#login( credentials )', () => {
    const credentials = { email: '', password: '' }

    test('[resolved]', async () => {
      Spy.resolved(Axios, 'post', {
        data: { user: mockedUser },
        status: 200,
        headers: { authorization: 'SOME_AUTH_X_HEADER' },
      })
      expect(SessionStore.fetch()).toBeNull()
      expect(await UsersController.login(credentials)).toEqual(mockedUser)
      expect(SessionStore.fetch()).not.toBeNull()
    })

    test('[rejected]', async () => {
      Spy.rejected(Axios, 'post', {
        message: 'Unauthorized',
        status: 401,
      })
      try {
        await UsersController.login(credentials)
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
      Spy.resolved(Axios, 'delete', { status: 200 })
      await UsersController.logout()
      expect(SessionStore.fetch()).toBeNull()
    })

    test('fails to log out on server', async () => {
      expect(SessionStore.fetch()).not.toBeNull()
      Spy.rejected(Axios, 'delete', { status: 500 })
      try {
        await UsersController.logout()
      } catch {
        expect(SessionStore.fetch()).toBeNull()
      }
    })
  })

  describe('#register( requirements ) ', () => {
    test('[resolved]', async () => {
      Spy.resolved(Axios, 'post', {
        status: 201,
        headers: { authorization: 'SOME_AUTH_TOKEN' },
        data: { user: mockedUser },
      })
      expect(SessionStore.fetch()).toBeNull()
      expect(await UsersController.register(Generic.newUser())).toEqual(mockedUser)
      expect(SessionStore.fetch()).not.toBeNull()
    })

    test('[rejected]', async () => {
      Spy.rejected(Axios, 'post', {
        status: 402,
        message: 'unprocessable entity',
      })
      try {
        await UsersController.register(Generic.newUser())
      } catch (exc) {
        expect(SessionStore.fetch()).toBeNull()
        expect(exc).toBe('unprocessable entity')
      }
    })
  })

  describe('#signedUser()', () => {
    test('[resolved]', async () => {
      SessionStore.persist('SOME_AUTH_TOKEN')
      Spy.resolved(Axios, 'get', {
        status: 200,
        headers: { authorization: 'SOME_NEW_AUTH_TOKEN' },
        data: { user: mockedUser },
      })
      expect(await UsersController.signedUser()).toEqual(mockedUser)
      expect(SessionStore.fetch()).toBe('SOME_NEW_AUTH_TOKEN')
    })

    test('[rejected]', async () => {
      SessionStore.persist('SOME_AUTH_TOKEN')
      Spy.rejected(Axios, 'get', { status: 401 })

      try {
        await UsersController.signedUser()
      } catch {
        expect(SessionStore.fetch()).toBeNull()
      }
    })

    test('when ensureAuthorizationExists() fails', () => {
      UsersController
        .signedUser()
        .then(() => { throw new Error('Failure') })
        .catch(() => {})
    })
  })

  describe('#refresh()', () => {
    test('[resolved]', async () => {
      Spy.resolved(Axios, 'head', {
        status: 200,
        headers: { authorization: 'SOME_NEW_AUTH_TOKEN' },
      })
      SessionStore.persist('SOME_AUTH_TOKEN')
      await UsersController.refresh()
      expect(SessionStore.fetch()).toBe('SOME_NEW_AUTH_TOKEN')
    })

    test('[rejected]', async () => {
      SessionStore.persist('SOME_AUTH_TOKEN')
      Spy.rejected(Axios, 'head', { status: 401 })

      try {
        await UsersController.refresh()
      } catch {
        expect(SessionStore.fetch()).toBeNull()
      }
    })

    test('when ensureAuthorizationExists() fails', () => {
      UsersController
        .refresh()
        .then(() => { throw new Error('Failure') })
        .catch(() => {})
    })
  })
})
