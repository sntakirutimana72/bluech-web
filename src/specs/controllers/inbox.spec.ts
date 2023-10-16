import { Axios } from '@/helpers/requests'
import { InboxController } from '@/controllers/v1'
import Spy from '#test-support/mocks/spy'
import Generic from '#test-support/mocks/generic'

describe('InboxController', () => {
  afterEach(() => localStorage.clear())

  afterAll(() => Generic.clear())

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
