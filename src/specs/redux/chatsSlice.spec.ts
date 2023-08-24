import Generic from '../support/mocks/generic'
import reducer, {
  userTyping,
  typingExpired,
  mapMessage,
  populateConversation,
} from '../../redux/features/chatsSlice'

const initialState: ReturnType<typeof reducer> = { messages: {}, typings: {} }

describe('chatsSlice', () => {
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
