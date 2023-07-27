import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UsersController } from '../../controllers'

type PeopleState = {
  status: ThunkStatus
  people: Personnel[]
  pagination: Pagination
}

export const queryPeople = createAsyncThunk<People, number>(
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
      .addCase(queryPeople.pending, () => ({
        ...initialState, status: 'pending',
      }))
      .addCase(queryPeople.fulfilled, (_, action) => ({
        ...action.payload, status: 'loaded',
      }))
      .addCase(queryPeople.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default slicer.reducer
