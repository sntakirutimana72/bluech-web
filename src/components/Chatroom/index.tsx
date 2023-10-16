import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { nilFunc } from '@/helpers/utils'
import { MessagesController } from '@/controllers/v1'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { markedAsRead, populateConversation } from '@/redux/features/chatsSlice'
import { clearCounter } from '@/redux/features/inboxSlice'
import { chatsSelector } from '@/redux/effects/chatsEffects'
import { userSelector } from '@/redux/effects/peopleEffects'
import ChatList from './ChatList'
import Composer from './Composer'

const Chatroom = () => {
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

  useEffect(() => { dispatch(clearCounter(channelId!)) }, [channelId])

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

  return (
    <div className="chats-room">
      <nav className="chats-room-nav">
        <h2>
          {partner?.name}
        </h2>
      </nav>
      <ChatList list={chats} />
      { isTyping && (
        <div className="is-typing">{`${partner!.name} is typing..`}</div>
      ) }
      <Composer channelId={channelId!} className="chats-room-composer" />
    </div>
  )
}
export default Chatroom
