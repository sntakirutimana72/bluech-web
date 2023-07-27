type AlphaNumeric = string | number

// Cable Objects Types
//
// Message
type CableMessage = {
  id: AlphaNumeric
  desc: string
  is_edited: boolean
  creation_date: Date
  last_update: Date | null
  author: CableMessageAuthor
}
// Message Author
type CableMessageAuthor = {
  id: AlphaNumeric
  name: string
}

type NewUser = {
  name: string
  email: string
  password: string
}

type CurrentUser = Pick<NewUser, 'name' | 'email'> & {
  id: AlphaNumeric
}

type ThunkStatus = 'idle' | 'pending' | 'loaded' | 'failed'

type InboxPreview = {
  id: AlphaNumeric
  avatar?: string
  unreadCount: number
  preview: string
}

type Personnel = CableMessageAuthor & {
  bio: string
  avatar?: string
  online?: boolean
}

type Pagination = {
  previous?: number | null
  current?: number
  next?: number | null
  pages?: number
}

type Conversation = {
  chats: CableMessage[]
  pagination: Pagination
  channel?: AlphaNumeric
}

type ConvoParams = {
  page?: number
  channel: AlphaNumeric
}

type People = {
  people: Personnel[]
  pagination: Pagination
}
