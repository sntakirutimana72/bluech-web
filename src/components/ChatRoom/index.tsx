import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { uid } from 'uid'
import Composer from './Composer'
import MessageElement from './MessageElement'
import { isInit } from '../../helpers/utils'
import { useAppSelector, useSession } from '../../hooks'
import { populateConversation } from '../../redux/features/chatsSlice'
import { chatsSelector } from '../../redux/effects/chatsEffects'
import { userSelector } from '../../redux/effects/peopleEffects'

const ChatRoom = () => {
  const { currentUser } = useSession()
  const { id: channelId } = useParams()
  const partner = useAppSelector(userSelector(channelId!))
  const { conversation, isTyping } = useAppSelector(chatsSelector(channelId!))
  const { chats, pagination } = conversation
  const { current: currentPage, pages } = pagination
  const [page, setPage] = useState(currentPage)

  useEffect(
    () => {
      if (!isInit(pages)) {
        setPage(1)
      } else if (page && pages && page <= pages) {
        populateConversation({ channel: channelId!, page })
      }
    },
    [channelId, page],
  )

  return (
    <div className="chats-room">
      <nav className="chats-room-nav">
        <h2>
          Room #:
          {channelId}
        </h2>
      </nav>

      <div className="chats-list-overlay">
        <div className="chats-list">
          { chats && chats.map((item) => (
            <MessageElement key={uid()} item={item} isSelf={item.author.id === currentUser!.id} />
          )) }
        </div>
      </div>

      { isTyping && (
        <div className="is-typing">{`${partner!.name} is typing..`}</div>
      ) }

      <Composer channelId={channelId!} currentUser={currentUser!} className="chats-room-composer" />
    </div>
  )
}
export default ChatRoom
