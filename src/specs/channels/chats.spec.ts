import { TestCable } from '@anycable/core/testing'
import { ChatsChannel } from '@/channels'
import type { TypingMessage, ChatMessage, AsSeenMessage } from '@/channels'
import Generic from '#test-support/mocks/generic'

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

  test('fires :message event', () => {
    const onMessage = jest.fn()
    const chatMessage: ChatMessage = { type: 'message', message: Generic.cableMessage(undefined, id) }

    channel.on('message', onMessage)
    channel.receive(chatMessage)
    expect(onMessage).toHaveBeenCalled()
  })

  test('fires :typing event', () => {
    const onTyping = jest.fn()
    const typingMessage: TypingMessage = { type: 'typing', author: partner, status: false }

    channel.on('typing', onTyping)
    channel.receive(typingMessage)
    expect(onTyping).toHaveBeenCalled()
  })

  test('fires :read event', () => {
    const onSeen = jest.fn()
    const asSeenMessage: AsSeenMessage = { type: 'read', channelId: 2, ids: ['2'] }

    channel.on('read', onSeen)
    channel.receive(asSeenMessage)
    expect(onSeen).toHaveBeenCalled()
  })

  test('disconnects on leave', () => {
    channel.leave()
    expect(channel.state).toEqual('closed')
  })
})
