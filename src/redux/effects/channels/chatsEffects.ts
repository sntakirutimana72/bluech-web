import { RootState } from "../../../store/redux"

type StateQuery = {
  id: AlphaNumeric
}
export const getState = ({ id }: StateQuery) => ({ chats }: RootState) => ({
  items: chats.messages[id],
  isTyping: chats.typings[id],
})
