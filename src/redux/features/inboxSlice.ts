import { createSlice, createAsyncThunk, Draft } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { InboxController } from '../../controllers/v1'

type InboxState = {
  status: ThunkStatus
  previews: InboxPreview[]
}

const findPreview = (targetId: AlphaNumeric, { previews }: Draft<Pick<InboxState, 'previews'>>) => (
  previews.find(({ id }) => id.toString() === targetId.toString())
)

export const previewInbox = createAsyncThunk<InboxPreview[]>(
  'home/inbox',
  () => InboxController.preview(),
)

const initialState: InboxState = { status: 'idle', previews: [] }

const slicer = createSlice({
  name: 'dashboard/inbox',
  initialState,
  reducers: {
    incrementUCounter(state, action: PayloadAction<InboxCounter>) {
      const { payload: { id, ...others } } = action
      let inbox = findPreview(id, state)

      if (!inbox) {
        inbox = { unread: 0, id } as InboxPreview
        state.previews.push(inbox)
      }
      inbox.unread++
      Object.assign(inbox, others)
    },
    resetUCounter(state, action: PayloadAction<InboxCounter>) {
      const { payload: { id, ...others } } = action
      let inbox = findPreview(id, state)

      if (!inbox) {
        inbox = { id } as InboxPreview
        state.previews.push(inbox)
      }
      inbox.unread = 0
      Object.assign(inbox, others)
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
