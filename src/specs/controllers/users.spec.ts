import AxiosMocker from '../support/mocks/axios'
import Generic from '../support/mocks/generic'
import { UsersController } from '../../controllers'

afterEach(() => { localStorage.clear() })

describe('UsersController', () => {
  describe('#people( page )', () => {
    test('[resolved]', async () => {
      const mockedPeople: People = {
        people: [Generic.personnel()], pagination: Generic.paginate(),
      }
      AxiosMocker.resolved('get', { data: mockedPeople, status: 200 })
      expect(await UsersController.people(1)).toEqual(mockedPeople)
    })

    test('[rejected]', async () => {
      AxiosMocker.rejected('get', { message: 'Unauthorized', status: 401 })
      try {
        await UsersController.people(1)
      } catch (exc) {
        expect(exc).toBe('Unauthorized')
      }
    })
  })
})
