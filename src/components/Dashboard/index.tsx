import { useEffect, useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Unsubscribe } from 'nanoevents'
import {
  useAppDispatch,
  useAppSelector,
  useSession,
  useCable,
} from '@/hooks'
import { ChatsChannel } from '@/channels'
import type { ChatMessage, TypingMessage, AsSeenMessage } from '@/channels'
import { statusesSelector } from '@/redux/effects/appEffects'
import { populatePeople } from '@/redux/features/peopleSlice'
import { previewInbox, incrementUCounter } from '@/redux/features/inboxSlice'
import {
  markedAsRead,
  mapMessage,
  userTyping,
  typingExpired,
} from '@/redux/features/chatsSlice'
import { TopNav, BottomNav } from './Navs'

const Dashboard = () => {
  const [ready, setReady] = useState(false)
  const { currentUser } = useSession()
  const { cable } = useCable()
  const { inboxStatus, peopleStatus } = useAppSelector(statusesSelector)
  const dispatch = useAppDispatch()
  const channelRef = useRef<ChatsChannel>()

  const onTyping = ({ author: { id }, status }: TypingMessage) => {
    dispatch(status ? userTyping(id) : typingExpired(id))
  }

  const onMessage = ({ message } : ChatMessage) => {
    const { desc, createdAt, author: { id } } = message
    dispatch(mapMessage(message))
    dispatch(incrementUCounter({ id, createdAt, preview: desc }))
  }

  const onSeen = (msgUpdate: AsSeenMessage) => {
    dispatch(markedAsRead(msgUpdate as CableSeen))
  }

  useEffect(
    () => {
      const readiness: ThunkStatus[] = ['failed', 'loaded']
      let unbinders: Unsubscribe[]

      if (!ready && inboxStatus === 'idle' && peopleStatus === 'idle') {
        dispatch(populatePeople(1))
        dispatch(previewInbox())
      } else if (
        !ready
        && readiness.includes(inboxStatus)
        && readiness.includes(peopleStatus)
      ) {
        if (cable && !channelRef.current) {
          channelRef.current = cable.subscribe(new ChatsChannel())
          unbinders = [
            channelRef.current.on('typing', onTyping),
            channelRef.current.on('message', onMessage),
            channelRef.current.on('read', onSeen),
          ]
        }
        setReady(true)
      }
      return () => {
        unbinders?.forEach((cb) => { cb() })
        channelRef.current?.leave()
      }
    },
    [inboxStatus, peopleStatus, cable],
  )

  return (
    <div className="dashboard">
      <TopNav currentUser={currentUser as CurrentUser} />
      <div className="views-manager">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

export default Dashboard
