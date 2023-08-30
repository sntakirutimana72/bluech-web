import { TestCable } from '@anycable/core/testing'
import { ChatsChannel } from '../../channels'
import Generic from '../support/mocks/generic'
import type { TypingMessage, ChatMessage, AsSeenMessage } from '../../channels'

describe('ChatsChannel', () => {
  let channel: ChatsChannel
  let cable: TestCable

  const partner = { id: 3, name: 'Steve' }
  const { id } = Generic.currentUser()

  beforeEach(() => {
    cable = new TestCable()
    channel = cable.subscribe(new ChatsChannel())
  })

  afterAll(() => {
    Generic.clear()
  })

  test('perform typing action', async () => {
    const typingSignal = { channelId: id, status: true }
    await channel.typing(typingSignal)
    expect(cable.outgoing).toEqual([{ action: 'typing', payload: typingSignal }])
  })

  test('fires events on receipt', () => {
    const onTyping = jest.fn()
    const onMessage = jest.fn()
    const onSeen = jest.fn()
    const asSeenMessage: AsSeenMessage = { type: 'read', readerId: 2, ids: ['2'] }
    const typingMessage: TypingMessage = { type: 'typing', author: partner, status: false }
    const chatMessage: ChatMessage = { type: 'message', message: Generic.cableMessage(undefined, id) }

    channel.on('typing', onTyping)
    channel.on('message', onMessage)
    channel.on('read', onSeen)
    channel.receive(asSeenMessage)
    channel.receive(chatMessage)
    channel.receive(typingMessage)

    expect(onSeen).toHaveBeenCalled()
    expect(onTyping).toHaveBeenCalled()
    expect(onMessage).toHaveBeenCalled()
  })

  test('disconnects on leave', () => {
    channel.leave()
    expect(channel.state).toEqual('closed')
  })
})
