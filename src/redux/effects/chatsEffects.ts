import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../store/redux'

const getState = (state: RootState) => state.chats

export const chatsSelector = (ownerId: AlphaNumeric) => createSelector(
  [getState],
  ({ messages, typings }) => ({
    conversation: messages[ownerId] || { chats: [], pagination: {} },
    isTyping: typings[ownerId],
  }),
)
