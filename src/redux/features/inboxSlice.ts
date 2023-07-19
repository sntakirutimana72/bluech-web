import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MessagesController } from '../../controllers/v1'

type Counter = {
  id: AlphaNumeric
  preview: string
}

type InboxState = {
  status: ThunkStatus
  previews: InboxPreview[]
}

export const previewInbox = createAsyncThunk<InboxPreview[]>(
  'dashboard/inbox',
  MessagesController.inbox,
)

const initialState: InboxState = { status: 'idle', previews: [] };

const slicer = createSlice({
  name: 'dashboard/inbox',
  initialState,
  reducers: {
    incrementUCounter(state, action: PayloadAction<Counter>) {
      const { previews } = state
      const { payload: { id: dataId, preview } } = action

      const inbox = previews.find(
        ({ id }) => id === dataId,
      )

      if (!inbox) {
        previews.push({ id: dataId, unreadCount: 1, preview })
      } else {
        inbox.unreadCount++
        inbox.preview = preview
      }
    },
    resetUCounter(state, action: PayloadAction<Counter>) {
      const { previews } = state
      const { payload: { id: dataId, preview } } = action

      const inbox = previews.find(
        ({ id }) => id === dataId,
      )

      if (!inbox) {
        previews.push({ id: dataId, preview, unreadCount: 0 })
      } else {
        inbox.unreadCount = 0
        inbox.preview = preview
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(previewInbox.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(previewInbox.fulfilled, (_, action) => ({
        status: 'loaded',
        previews: action.payload,
      }))
      .addCase(previewInbox.rejected, (state) => {
        state.status = 'failed'
      });
  },
})

export const {
  incrementUCounter,
  resetUCounter,
} = slicer.actions

export default slicer.reducer
