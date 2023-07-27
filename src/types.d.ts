type AlphaNumeric = string | number

type NullableNumeric = number | null

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
  unread: number
  preview: string
  creation_date: Date
}

type Personnel = CableMessageAuthor & {
  bio: string
  avatar?: string
  online?: boolean
}

type Pagination = {
  current?: NullableNumeric
  pages?: NullableNumeric
}

type Conversation = {
  status?: ThunkStatus
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
