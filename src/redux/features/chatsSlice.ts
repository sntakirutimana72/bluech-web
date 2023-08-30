import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MessagesController } from '../../controllers/v1'

type ChatsState = {
  typings: { [key: AlphaNumeric]: boolean }
  messages: { [key: AlphaNumeric]: Conversation }
}

export const populateConversation = createAsyncThunk<Conversation, ConvoParams>(
  'channels/conversation',
  (params: ConvoParams) => MessagesController.conversation(params),
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
      const { author: { id }, recipientId } = payload
      const targetId = recipientId || id
      const { messages } = state

      if (!messages[targetId]) {
        messages[targetId] = { chats: [], pagination: {} }
      }
      messages[targetId].chats.push(payload)
    },
    markedAsRead(state, action: PayloadAction<CableSeen>) {
      const { payload: { ids, readerId } } = action
      const { messages } = state
      messages[readerId]?.chats.forEach((chat) => {
        if (ids.includes(chat.id.toString())) {
          chat.isSeen = true
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(populateConversation.pending, (state, action) => {
        const { messages } = state
        const { meta: { arg: { channelId } } } = action
        const convo = (messages[channelId] ||= { chats: [], pagination: {} })
        convo.status = 'pending'
      })
      .addCase(populateConversation.fulfilled, (state, action) => {
        const { chats, pagination } = action.payload
        const { meta: { arg: { channelId } } } = action
        state.messages[channelId] = { chats, pagination, status: 'loaded' }
      })
      .addCase(populateConversation.rejected, (state, action) => {
        const { messages } = state
        const { meta: { arg: { channelId } } } = action
        const convo = (messages[channelId] ||= { chats: [], pagination: {} })
        convo.status = 'failed'
      })
  },
})

export const {
  userTyping,
  typingExpired,
  mapMessage,
  markedAsRead,
} = slicer.actions
export default slicer.reducer
