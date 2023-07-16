import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type ChatsState = {
  typings: {
    [key: AlphaNumeric]: boolean
  }
  messages: {
    [key: AlphaNumeric]: CableMessage[]
  }
}

const initialState: ChatsState = {
  typings: {},
  messages: {}
}
const slicer = createSlice({
  name: 'channels/chats',
  initialState,
  reducers: {
    userTyping(state, action: PayloadAction<AlphaNumeric>) {
      state.typings[action.payload] = true
    },
    typingExpired(state, action: PayloadAction<AlphaNumeric>) {
      delete state.typings[action.payload]
    },
    mapMessage(state, action: PayloadAction<CableMessage>) {
      state.messages[action.payload.author.id].push(action.payload)
    }
  },
})

export const { userTyping, typingExpired, mapMessage } = slicer.actions
export default slicer.reducer
