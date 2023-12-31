import reducer, {
  userTyping,
  typingExpired,
  mapMessage,
  markedAsRead,
  populateConversation,
} from '@/redux/features/chatsSlice'
import Generic from '#test-support/mocks/generic'

describe('chatsSlice', () => {
  afterAll(() => Generic.clear())

  const initialState: ReturnType<typeof reducer> = { messages: {}, typings: {} }
  const mockedMeta = (id: AlphaNumeric) => ({ meta: { arg: { channelId: id } } })

  test('userTyping', () => {
    const authorId = 77
    expect(reducer(initialState, userTyping(authorId))).toEqual({
      ...initialState, typings: { [authorId]: true },
    })
  })

  test('typingExpired', () => {
    const authorId = 33
    const state = { ...initialState, typings: { [authorId]: true } }
    expect(reducer(state, typingExpired(authorId))).toEqual(initialState)
  })

  test('mapMessage', () => {
    const authorId = 3
    const msg = Generic.cableMessage(undefined, authorId)
    expect(reducer(initialState, mapMessage(msg))).toEqual({
      ...initialState, messages: { [authorId]: { chats: [msg], pagination: {} } },
    })
  })

  test('markedAsRead', () => {
    const chat = Generic.cableMessage()
    const { author: { id: channelId } } = chat
    const actionPayload: CableSeen = { channelId, ids: ['1', '2'] }
    const state = {
      ...initialState,
      messages: { [channelId]: { chats: [{ ...chat }], pagination: {} } },
    }
    expect(reducer(state, markedAsRead(actionPayload))).toEqual({
      ...state,
      messages: { [channelId]: { chats: [{ ...chat, isSeen: true }], pagination: {} } },
    })
  })

  test('[populateConversation.pending]', () => {
    const channelId = 3
    const action = {
      type: populateConversation.pending.type,
      ...mockedMeta(channelId),
    }
    const { messages } = reducer(initialState, action)
    expect(messages[channelId].status).toBe('pending')
  })

  test('[populateConversation.fulfilled]', () => {
    const channelId = 3
    const msg = Generic.cableMessage(undefined, channelId)
    const state = {
      typings: {},
      messages: { [channelId]: { chats: [msg], pagination: {} } },
    }
    const { messages } = reducer(state, {
      type: populateConversation.fulfilled.type,
      payload: { chats: [msg], pagination: { current: 1, pages: 2 }, channelId },
      ...mockedMeta(channelId),
    })
    const convo = messages[channelId]

    expect(convo.status).toBe('loaded')
    expect(state.messages[channelId].pagination).not.toEqual(convo.pagination)
  })

  test('[populateConversation.rejected]', () => {
    const channelId = 3
    const { messages } = reducer(initialState, {
      type: populateConversation.rejected.type,
      ...mockedMeta(channelId),
    })
    expect(messages[channelId].status).toBe('failed')
  })
})
