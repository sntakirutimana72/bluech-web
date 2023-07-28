import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import { Axios } from '../../helpers/requests'
import { MessagesController } from '../../controllers/v1'

afterEach(() => { localStorage.clear() })

describe('MessagesController', () => {
  describe('#create( message )', () => {
    test('[resolved]', async () => {
      const mockedMessage = Generic.cableMessage(18, 32)
      Spy.resolved(Axios, 'post', { data: { message: mockedMessage }, status: 201 })
      expect(await MessagesController.create({ desc: '', recipient_id: 32 })).toEqual(mockedMessage)
    })

    test('[rejected]', async () => {
      Spy.rejected(Axios, 'post', { message: 'Unprocessable entity', status: 422 })

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
      Spy.resolved(Axios, 'get', { data: mockedConvo, status: 200 })
      expect(await MessagesController.conversation({ channel })).toEqual(mockedConvo)
    })

    test('[rejected]', async () => {
      Spy.rejected(Axios, 'get', { message: 'Bad Request', status: 400 })

      try {
        await MessagesController.conversation({ channel: 'wrong channel' })
      } catch (exc) {
        expect(exc).toBe('Bad Request')
      }
    })
  })
})
