import { TestCable } from '@anycable/core/testing'
import { ChatsChannel } from '../../channels'
import type { TypingMessage, ChatMessage } from '../../channels'
import Generic from '../support/mocks/generic'

describe('ChatsChannel', () => {
  let channel: ChatsChannel
  let cable: TestCable

  const partner = { id: 3, name: 'Steve' }
  const { id, name } = Generic.currentUser()

  beforeEach(() => {
    cable = new TestCable()
    channel = new ChatsChannel({ id, name })
    cable.subscribe(channel)
  })

  test('perform a typing action', async () => {
    await channel.typing(partner.id)

    expect(cable.outgoing).toEqual([
      { action: 'typing', payload: { channel: partner.id, author: { id, name } } },
    ])
  })

  test('fires events on receipt', () => {
    const onTyping = jest.fn()
    const onMessage = jest.fn()
    const typingMessage: TypingMessage = { type: 'typing', author: partner }
    const chatMessage: ChatMessage = { type: 'message', message: Generic.cableMessage(11, id) }

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
