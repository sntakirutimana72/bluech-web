import { memo } from 'react'
import { mapUIDToList } from '@/helpers/utils'
import { List } from '@/components/elements/Lists'
import type { ChatMessageListItemProps } from './ChatMessage'
import ChatMessage from './ChatMessage'

type Props = {
  list: CableMessage[]
}

const ChatList = ({ list }: Props) => (
  <div className="chats-list-overlay">
    <List<ChatMessageListItemProps>
      className="chats-list"
      ListItem={ChatMessage}
      list={mapUIDToList<CableMessage, ChatMessageListItemProps>('msg-', list)}
    />
  </div>
)

export default memo(ChatList)
