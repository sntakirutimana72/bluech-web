import React, {
  useEffect,
  useState,
  useRef,
  memo,
} from 'react'
import { Send } from '@mui/icons-material'
import { useCable, useAppDispatch } from '@/hooks'
import { nilFunc } from '@/helpers/utils'
import { mapMessage } from '@/redux/features/chatsSlice'
import { resetUCounter } from '@/redux/features/inboxSlice'
import { ChatsChannel } from '@/channels'
import { MessagesController } from '@/controllers/v1'
import { Text } from '@/components/elements/Fields'

type Props = React.HTMLProps<HTMLFormElement> & {
  channelId: AlphaNumeric
}

const Composer = ({ channelId, ...props }: Props) => {
  const [value, setValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { cable } = useCable()
  const channelRef = useRef<ChatsChannel>()
  const typingTimer = useRef<NodeJS.Timer>()
  const dispatch = useAppDispatch()

  const sendTyping = (status: boolean) => {
    if (!channelRef.current) {
      channelRef.current = cable?.subscribe(new ChatsChannel())
    }
    channelRef.current?.typing({ channelId, status }).then(nilFunc, nilFunc)
  }

  const cancelTyingTimer = () => {
    if (typingTimer.current) {
      clearTimeout(typingTimer.current)
      typingTimer.current = undefined
    }
  }

  const cancelAll = () => {
    cancelTyingTimer()
    sendTyping(false)
    setIsTyping(false)
  }

  const clearAll = () => {
    cancelTyingTimer()

    if (channelRef.current) {
      channelRef.current?.leave()
      channelRef.current = undefined
    }
  }

  const startTypingTimer = () => {
    if (typingTimer.current) {
      cancelTyingTimer()
    }
    typingTimer.current = setTimeout(cancelAll, 15000)
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value)
    setIsTyping(true)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    cancelAll()

    if (value) {
      MessagesController
        .create({ desc: value, recipient_id: channelId })
        .then((msg) => {
          const inboxUCounter: InboxCounter = {
            id: channelId, preview: msg.desc, createdAt: msg.createdAt,
          }
          dispatch(mapMessage({ ...msg, recipientId: channelId }))
          dispatch(resetUCounter(inboxUCounter))
        }, nilFunc)
      setValue('')
    }
  }

  useEffect(
    () => {
      if (isTyping && cable) {
        sendTyping(true)
        startTypingTimer()
      }
      return () => { clearAll() }
    },
    [isTyping, cable],
  )

  return (
    <form onSubmit={onSubmit} {...props}>
      <Text
        input={{
          id: 'chats_channel_#{partner}',
          name: 'message',
          placeholder: 'Enter Message',
          value,
          onChange,
          onBlur: cancelAll,
        }}
        label={{ val: 'Message', className: 'hidden' }}
      />
      <button type="submit" title="Send">
        <Send />
      </button>
    </form>
  )
}

export default memo(Composer)
