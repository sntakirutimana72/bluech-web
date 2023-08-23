import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import { Axios } from '../../helpers/requests'
import { InboxController } from '../../controllers/v1'

afterEach(() => { localStorage.clear() })
afterAll(() => { Generic.resetAll() })

describe('InboxController', () => {
  describe('#preview()', () => {
    test('[resolved]', async () => {
      const mockedInbox = [Generic.inboxPreview()]
      Spy.resolved(Axios, 'get', { data: { previews: mockedInbox }, status: 200 })
      expect(await InboxController.preview()).toEqual(mockedInbox)
    })

    test('[rejected]', async () => {
      Spy.rejected(Axios, 'get', { message: 'Unauthorized', status: 401 })

      try {
        await InboxController.preview()
      } catch (exc) {
        expect(exc).toBe('Unauthorized')
      }
    })
  })
})
