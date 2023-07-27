import AxiosMocker from '../support/mocks/axios'
import Generic from '../support/mocks/generic'
import { InboxController } from '../../controllers/v1'

afterEach(() => { localStorage.clear() })

describe('InboxController', () => {
  describe('#preview()', () => {
    test('[resolved]', async () => {
      const mockedInbox = [Generic.inboxPreview(9)]
      AxiosMocker.resolved('get', { data: { previews: mockedInbox }, status: 200 })
      expect(await InboxController.preview()).toEqual(mockedInbox)
    })

    test('[rejected]', async () => {
      AxiosMocker.rejected('get', { message: 'Unauthorized', status: 401 })

      try {
        await InboxController.preview()
      } catch (exc) {
        expect(exc).toBe('Unauthorized')
      }
    })
  })
})
