import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../store/redux'

const getState = (state: RootState) => state.chats

export const chatsSelector = (ownerId: AlphaNumeric) => createSelector(
  [getState],
  (chats) => ({
    conversation: chats.messages[ownerId],
    isTyping: chats.typings[ownerId],
  }),
)
