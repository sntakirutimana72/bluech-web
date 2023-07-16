import { combineReducers } from '@reduxjs/toolkit'
import { chats, users } from './channels'
import inbox from "./inboxSlice"

export default combineReducers({ chats, users, inbox })
