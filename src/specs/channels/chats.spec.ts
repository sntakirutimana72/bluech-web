import { TestCable } from '@anycable/core/testing'
import { ChatsChannel } from '../../channels'
import type { TypingMessage, ChatMessage } from '../../channels'
import Generic from '../support/mocks/generic'

afterAll(() => { Generic.resetAll() })

describe('ChatsChannel', () => {
  let channel: ChatsChannel
  let cable: TestCable

  const partner = { id: 3, name: 'Steve' }
  const { id } = Generic.currentUser()

  beforeEach(() => {
    cable = new TestCable()
    channel = cable.subscribe(new ChatsChannel())
  })

  test('perform typing action', async () => {
    await channel.typing(id)
    expect(cable.outgoing).toEqual([{ action: 'typing', payload: { channelId: id } }])
  })

  test('fires events on receipt', () => {
    const onTyping = jest.fn()
    const onMessage = jest.fn()
    const typingMessage: TypingMessage = { type: 'typing', author: partner }
    const chatMessage: ChatMessage = { type: 'message', message: Generic.cableMessage(undefined, id) }

    channel.on('typing', onTyping)
    channel.on('message', onMessage)
    channel.receive(chatMessage)
    channel.receive(typingMessage)

    expect(onTyping).toHaveBeenCalled()
    expect(onMessage).toHaveBeenCalled()
  })

  test('disconnects on leave', () => {
    channel.leave()
    expect(channel.state).toEqual('closed')
  })
})
