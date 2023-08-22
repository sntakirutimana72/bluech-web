import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { InboxController } from '../../controllers/v1'
import { now } from '../../helpers/utils'

type Counter = {
  id: AlphaNumeric
  preview: string
}

type InboxState = {
  status: ThunkStatus
  previews: InboxPreview[]
}

export const previewInbox = createAsyncThunk<InboxPreview[]>(
  'home/inbox',
  () => InboxController.preview(),
)

const initialState: InboxState = { status: 'idle', previews: [] }

const slicer = createSlice({
  name: 'dashboard/inbox',
  initialState,
  reducers: {
    incrementUCounter(state, action: PayloadAction<Counter>) {
      const { previews } = state
      const { payload: { id: dataId, preview } } = action

      let inbox = previews.find(
        ({ id }) => id === dataId,
      )

      if (!inbox) {
        inbox = { id: dataId, unread: 0 } as InboxPreview
        previews.push(inbox)
      }
      inbox.unread++
      inbox.preview = preview
      inbox.createdAt = now().toISOString()
    },
    resetUCounter(state, action: PayloadAction<Counter>) {
      const { previews } = state
      const { payload: { id: dataId, preview } } = action

      let inbox = previews.find(
        ({ id }) => id === dataId,
      )

      if (!inbox) {
        inbox = { id: dataId } as InboxPreview
        previews.push(inbox)
      }
      inbox.unread = 0
      inbox.preview = preview
      inbox.createdAt = now().toISOString()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(previewInbox.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(previewInbox.fulfilled, (_, action) => ({
        previews: action.payload, status: 'loaded',
      }))
      .addCase(previewInbox.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const {
  incrementUCounter,
  resetUCounter,
} = slicer.actions

export default slicer.reducer
