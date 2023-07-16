import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type User = {
  id: AlphaNumeric
  name: string
  avatar?: string | Blob
  online?: boolean
}

const initialState: User[] = []

const slicer = createSlice({
  name: 'channels/users',
  initialState,
  reducers: {
    connected(state, action: PayloadAction<AlphaNumeric>) {
      const user = state.find(({ id }) => id === action.payload)
      user!.online = true
    },
    disconnected(state, action: PayloadAction<AlphaNumeric>) {
      const user = state.find(({ id }) => id === action.payload)
      user!.online = false
    },
    subscribed(state, action: PayloadAction<User>) {
      state.push(action.payload)
    },
    repositoryLoaded: (_, action: PayloadAction<User[]>) => action.payload
  },
})

export const {
  connected,
  disconnected,
  subscribed ,
  repositoryLoaded,
} = slicer.actions
export default slicer.reducer
