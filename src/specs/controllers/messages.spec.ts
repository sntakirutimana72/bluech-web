import AxiosMocker from '../support/mocks/axios'
import Generic from '../support/mocks/generic'
import { MessagesController } from '../../controllers/v1'

afterEach(() => { localStorage.clear() })

describe('MessagesController', () => {
  describe('#create( message )', () => {
    test('[resolved]', async () => {
      const mockedMessage = Generic.cableMessage(18, 32)
      AxiosMocker.resolved('post', { data: { message: mockedMessage }, status: 201 })
      expect(await MessagesController.create({ desc: '', recipient_id: 32 })).toEqual(mockedMessage)
    })

    test('[rejected]', async () => {
      AxiosMocker.rejected('post', { message: 'Unprocessable entity', status: 422 })

      try {
        await MessagesController.create({ desc: '', recipient_id: 32 })
      } catch (exc) {
        expect(exc).toBe('Unprocessable entity')
      }
    })
  })

  describe('#conversation({ page, channel })', () => {
    test('[resolved]', async () => {
      const channel = 3
      const mockedConvo: Conversation = {
        chats: [Generic.cableMessage(11, 27)],
        pagination: Generic.paginate(),
      }
      AxiosMocker.resolved('get', { data: mockedConvo, status: 200 })
      expect(await MessagesController.conversation({ channel })).toEqual(mockedConvo)
    })

    test('[rejected]', async () => {
      AxiosMocker.rejected('get', { message: 'Bad Request', status: 400 })

      try {
        await MessagesController.conversation({ channel: 'wrong channel' })
      } catch (exc) {
        expect(exc).toBe('Bad Request')
      }
    })
  })
})
