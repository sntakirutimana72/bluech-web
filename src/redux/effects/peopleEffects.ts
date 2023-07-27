import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../store/redux'

export const peopleSelector = (state: RootState) => state.people

export const userSelector = (uid: AlphaNumeric) => createSelector(
  [peopleSelector],
  (state) => state.people.find((user) => user.id === uid),
)
