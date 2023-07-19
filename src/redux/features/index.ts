import { combineReducers } from '@reduxjs/toolkit';
import chats from './chatsSlice';
import inbox from './inboxSlice';
import people from './peopleSlice';

export default combineReducers({ people, inbox, chats })
