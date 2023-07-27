import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UsersController } from '../../controllers'

type PeopleState = {
  status: ThunkStatus
  people: Personnel[]
  pagination: Pagination
}

export const populatePeople = createAsyncThunk<People, number>(
  'home/people',
  UsersController.people,
)

const initialState: PeopleState = {
  status: 'idle',
  people: [],
  pagination: {},
}

const slicer = createSlice({
  name: 'dashboard/people',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(populatePeople.pending, () => ({
        ...initialState, status: 'pending',
      }))
      .addCase(populatePeople.fulfilled, (_, action) => ({
        ...action.payload, status: 'loaded',
      }))
      .addCase(populatePeople.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default slicer.reducer
