import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MessagesController } from '../../controllers/v1'

type ChatsState = {
  typings: { [key: AlphaNumeric]: boolean }
  messages: { [key: AlphaNumeric]: Conversation }
}

export const setConvoPendingStatus = createAction<AlphaNumeric>('channels/convo/pending')

export const populateConversation = createAsyncThunk<
  Conversation,
  ConvoParams,
  { rejectValue: AlphaNumeric }
>(
  'channels/conversation',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setConvoPendingStatus(params.channel))
      return await MessagesController.conversation(params)
    } catch {
      return rejectWithValue(params.channel)
    }
  },
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
      .addCase(populateConversation.fulfilled, (state, action) => {
        const { chats, pagination, channel } = action.payload
        state.messages[channel!] = { chats, pagination, status: 'loaded' }
      })
      .addCase(setConvoPendingStatus, (state, action) => {
        const { messages } = state
        const convo = (messages[action.payload!] ||= { chats: [], pagination: {} })
        convo.status = 'pending'
      })
      .addCase(populateConversation.rejected, (state, action) => {
        const { messages } = state
        const convo = (messages[action.payload!] ||= { chats: [], pagination: {} })
        convo.status = 'failed'
      })
  },
})

export const { userTyping, typingExpired, mapMessage } = slicer.actions
export default slicer.reducer
