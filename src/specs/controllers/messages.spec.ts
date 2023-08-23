import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import { Axios } from '../../helpers/requests'
import { MessagesController } from '../../controllers/v1'

afterEach(() => { localStorage.clear() })
afterAll(() => { Generic.resetAll() })

describe('MessagesController', () => {
  describe('#create( message )', () => {
    test('[resolved]', async () => {
      const message = Generic.cableMessage()
      const { author: { id: recipient_id } } = message
      Spy.resolved(Axios, 'post', { data: { message }, status: 201 })

      expect(await MessagesController.create({ desc: '', recipient_id })).toEqual(message)
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
      const channelId = 3
      const mockedConvo: Conversation = {
        chats: [Generic.cableMessage()], pagination: Generic.paginate(),
      }
      Spy.resolved(Axios, 'get', { data: mockedConvo, status: 200 })

      expect(await MessagesController.conversation({ channelId })).toEqual(mockedConvo)
    })

    test('[rejected]', async () => {
      Spy.rejected(Axios, 'get', { message: 'Bad Request', status: 400 })

      try {
        await MessagesController.conversation({ channelId: 'wrong channel' })
      } catch (exc) {
        expect(exc).toBe('Bad Request')
      }
    })
  })
})
