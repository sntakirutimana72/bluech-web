type AlphaNumeric = string | number

type NullableNumeric = number | null

type CableMessage = {
  id: AlphaNumeric
  desc: string
  isSeen?: boolean
  isEdited: boolean
  createdAt: string
  updatedAt: string | null
  author: CableMessageAuthor
  recipientId?: AlphaNumeric
}

type CableMessageAuthor = {
  id: AlphaNumeric
  name: string
}

type CableSeen = {
  channelId: AlphaNumeric
  ids: string[]
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
  createdAt: string
}

type InboxCounter = Omit<InboxPreview, 'avatar' | 'unread'>

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
}

type ConvoParams = {
  page?: number
  channelId: AlphaNumeric
}

type MarkAsReadParams = {
  authorId: AlphaNumeric
  ids: AlphaNumeric[]
}

type People = {
  people: Personnel[]
  pagination: Pagination
}
