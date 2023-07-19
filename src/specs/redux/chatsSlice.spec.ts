import Generic from '../support/mocks/generic'
import reducer, {
  userTyping,
  typingExpired,
  mapMessage,
} from '../../redux/features/chatsSlice'

const initialState: ReturnType<typeof reducer> = { messages: {}, typings: {} }

describe('chatsSlice', () => {
  test('userTyping', () => {
    const state = { ...initialState }
    expect(reducer(state, userTyping(77))).toEqual({
      ...initialState, typings: { 77: true },
    })
  })

  test('typingExpired', () => {
    const state = { ...initialState }
    state.typings[33] = true
    expect(reducer(state, typingExpired(33))).toEqual(initialState)
  })

  test('mapMessage', () => {
    const state = { ...initialState }
    const msg = Generic.cableMessage(11, 3)
    expect(reducer(state, mapMessage(msg))).toEqual({
      ...initialState, messages: { 3: [msg] },
    })
  })
})
