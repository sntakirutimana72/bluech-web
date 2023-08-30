import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { uid } from 'uid'
import { nilFunc } from '../../helpers/utils'
import { MessagesController } from '../../controllers/v1'
import { useAppSelector, useAppDispatch, useSession } from '../../hooks'
import { populateConversation, markedAsRead } from '../../redux/features/chatsSlice'
import { chatsSelector } from '../../redux/effects/chatsEffects'
import { userSelector } from '../../redux/effects/peopleEffects'
import Composer from './Composer'
import MessageElement from './MessageElement'

const ChatRoom = () => {
  const { currentUser } = useSession()
  const { channelId } = useParams()
  const partner = useAppSelector(userSelector(channelId!))
  const { conversation, isTyping } = useAppSelector(chatsSelector(channelId!))
  const dispatch = useAppDispatch()

  const {
    status,
    chats,
    pagination: { current, pages },
  } = conversation

  const [page] = useState(current)

  useEffect(
    () => {
      if (!status) {
        dispatch(populateConversation({ channelId: channelId! }))
      } else if (page && pages && page !== current && page <= pages && status !== 'pending') {
        dispatch(populateConversation({ channelId: channelId!, page }))
      }
    },
    [channelId, page, status],
  )

  useEffect(
    () => {
      const unreadIds = chats.filter(
        ({ isSeen, author: { id } }) => !isSeen && id.toString() === channelId!,
      ).map(
        ({ id }) => id,
      )
      if (unreadIds.length) {
        MessagesController
          .markAsRead({ authorId: channelId!, ids: unreadIds })
          .then(
            (ids) => {
              dispatch(markedAsRead({ channelId: channelId!, ids }))
            },
            nilFunc,
          )
      }
    },
    [chats],
  )

  const ChatsList = useMemo(() => (
    <div className="chats-list-overlay">
      <div className="chats-list">
        { chats.map((msg) => (
          <MessageElement key={uid()} msg={msg} isSelf={msg.author.id === currentUser!.id} />
        )) }
      </div>
    </div>
  ), [chats])

  const Prompt = useMemo(() => (
    <Composer channelId={channelId!} className="chats-room-composer" />
  ), [channelId])

  return (
    <div className="chats-room">
      <nav className="chats-room-nav">
        <h2>{partner?.name}</h2>
      </nav>
      {ChatsList}
      { isTyping && (
        <div className="is-typing">{`${partner!.name} is typing..`}</div>
      ) }
      {Prompt}
    </div>
  )
}
export default ChatRoom
