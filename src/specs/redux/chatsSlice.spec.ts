import Generic from '../support/mocks/generic'
import reducer, {
  userTyping,
  typingExpired,
  mapMessage,
  populateConversation,
  setConvoPendingStatus,
} from '../../redux/features/chatsSlice'

const initialState: ReturnType<typeof reducer> = { messages: {}, typings: {} }

afterEach(() => { localStorage.clear() })

describe('chatsSlice', () => {
  test('userTyping', () => {
    expect(reducer(initialState, userTyping(77))).toEqual({
      ...initialState, typings: { 77: true },
    })
  })

  test('typingExpired', () => {
    const state = { ...initialState, typings: { 33: true } }
    expect(reducer(state, typingExpired(33))).toEqual(initialState)
  })

  test('mapMessage', () => {
    const msg = Generic.cableMessage(11, 3)
    expect(reducer(initialState, mapMessage(msg))).toEqual({
      ...initialState, messages: { 3: { chats: [msg], pagination: {} } },
    })
  })

  test('setConvoPendingStatus', () => {
    const channel = 3
    const { messages } = reducer(initialState, setConvoPendingStatus(channel))

    expect(messages[channel].status).toBe('pending')
  })

  test('[populateConversation.fulfilled]', () => {
    const channel = 3
    const msg = Generic.cableMessage(11, channel)
    const state = {
      typings: {},
      messages: { [channel]: { chats: [msg], pagination: {} } },
    }
    const { messages } = reducer(state, {
      type: populateConversation.fulfilled.type,
      payload: { chats: [msg], pagination: { current: 1, pages: 2 }, channel },
    })

    const convo = messages[channel]
    expect(convo.status).toBe('loaded')
    expect(state.messages[channel].pagination).not.toEqual(convo.pagination)
  })

  test('[populateConversation.rejected]', () => {
    const channel = 3
    const { messages } = reducer(initialState, {
      type: populateConversation.rejected.type,
      payload: channel,
    })

    expect(messages[channel].status).toBe('failed')
  })
})
