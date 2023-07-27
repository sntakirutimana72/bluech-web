import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MessagesController } from '../../controllers/v1'

type ChatsState = {
  typings: { [key: AlphaNumeric]: boolean }
  messages: { [key: AlphaNumeric]: Conversation }
}

export const populateConversation = createAsyncThunk<Conversation, ConvoParams>(
  'channels/conversation',
  MessagesController.conversation,
)

const initialState: ChatsState = {
  typings: {},
  messages: {},
}

const slicer = createSlice({
  name: 'channels/chats',
  initialState,
  reducers: {
    userTyping(state, action: PayloadAction<AlphaNumeric>) {
      state.typings[action.payload] = true
    },
    typingExpired(state, action: PayloadAction<AlphaNumeric>) {
      state.typings = Object.fromEntries(
        Object
          .entries(state.typings)
          .filter(([id]) => id !== action.payload.toString()),
      )
    },
    mapMessage(state, action: PayloadAction<CableMessage>) {
      const { payload } = action
      const { author: { id } } = payload
      const { messages } = state

      if (!messages[id]) {
        messages[id] = { chats: [], pagination: {} }
      }
      messages[id].chats.push(payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(populateConversation.pending, (state, action) => {
        const { messages } = state
        const { meta: { arg: { channel } } } = action
        const convo = (messages[channel] ||= { chats: [], pagination: {} })
        convo.status = 'pending'
      })
      .addCase(populateConversation.fulfilled, (state, action) => {
        const { chats, pagination } = action.payload
        const { meta: { arg: { channel } } } = action
        state.messages[channel] = { chats, pagination, status: 'loaded' }
      })
      .addCase(populateConversation.rejected, (state, action) => {
        const { messages } = state
        const { meta: { arg: { channel } } } = action
        const convo = (messages[channel] ||= { chats: [], pagination: {} })
        convo.status = 'failed'
      })
  },
})

export const { userTyping, typingExpired, mapMessage } = slicer.actions
export default slicer.reducer
