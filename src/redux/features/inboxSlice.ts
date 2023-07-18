import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MessagesController } from '../../controllers/v1';

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
);

const initialState: InboxState = { status: 'idle', previews: [] };

const slicer = createSlice({
  name: 'dashboard/inbox',
  initialState,
  reducers: {
    incrementUCounter({ previews }, action: PayloadAction<Counter>) {
      const inbox = previews.find(
        ({ id }) => id === action.payload.id,
      );
      inbox!.unreadCount++;
      inbox!.preview = action.payload.preview;
    },
    resetUCounter({ previews }, action: PayloadAction<Counter>) {
      const inbox = previews.find(
        ({ id }) => id === action.payload.id,
      );
      inbox!.unreadCount = 0;
      inbox!.preview = action.payload.preview;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(previewInbox.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(previewInbox.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.previews = action.payload;
      })
      .addCase(previewInbox.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {
  incrementUCounter,
  resetUCounter,
} = slicer.actions;
export default slicer.reducer;
