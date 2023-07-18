import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UsersController } from '../../controllers'

type PeopleState = {
  status: ThunkStatus
  people: PeopleObj[]
}

export const queryPeople = createAsyncThunk<PeopleObj[], number>(
  'dashboard/people',
  UsersController.people
)
const initialState: PeopleState = { status: 'idle', people: [] }

const slicer = createSlice({
  name: 'dashboard/people',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(queryPeople.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(queryPeople.fulfilled, (state, action) => {
        state.status = 'loaded'
        state.people = action.payload
      })
      .addCase(queryPeople.rejected, (state) => {
        state.status = 'failed'
      })
  }
})

export default slicer.reducer
