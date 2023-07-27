import Generic from '../support/mocks/generic'
import reducer, {
  userTyping,
  typingExpired,
  mapMessage,
  populateConversation,
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
    const state = { ...initialState }
    state.typings[33] = true
    expect(reducer(state, typingExpired(33))).toEqual(initialState)
  })

  test('mapMessage', () => {
    const msg = Generic.cableMessage(11, 3)
    expect(reducer(initialState, mapMessage(msg))).toEqual({
      ...initialState, messages: { 3: { chats: [msg], pagination: {} } },
    })
  })

  test('[populateConversation.fulfilled]', () => {
    const channel = 3
    const msg = Generic.cableMessage(11, channel)
    const state = {
      typings: {},
      messages: { [channel]: { chats: [msg], pagination: {} } },
    }
    const newState = reducer(state, {
      type: populateConversation.fulfilled.type,
      payload: { chats: [msg], pagination: { current: 1 }, channel },
    })

    expect(state.messages[channel].pagination).not.toEqual(newState.messages[channel].pagination)
  })
})
