import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UsersController } from '@/controllers'

type PeopleState = People & {
  status: ThunkStatus
}

export const populatePeople = createAsyncThunk<People, number>(
  'home/people',
  (page: number) => UsersController.people(page),
)

const initialState: PeopleState = { status: 'idle', people: [], pagination: {} }

const slicer = createSlice({
  name: 'dashboard/people',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(populatePeople.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(populatePeople.fulfilled, (_, action) => ({
        ...action.payload, status: 'loaded',
      }))
      .addCase(populatePeople.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default slicer.reducer
