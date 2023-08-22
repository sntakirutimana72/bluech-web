import React, { useEffect, useState, useRef } from 'react'
import { Send } from '@mui/icons-material'
import { useCable, useAppDispatch } from '../../hooks'
import { nilFunc } from '../../helpers/utils'
import { mapMessage } from '../../redux/features/chatsSlice'
import { ChatsChannel } from '../../channels'
import { MessagesController } from '../../controllers/v1'
import { Text } from '../Elements'

type Props = React.HTMLProps<HTMLFormElement> & {
  channelId: AlphaNumeric
}

const Composer = ({ channelId, ...props }: Props) => {
  const [value, setValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { cable } = useCable()
  const channelRef = useRef<ChatsChannel>()
  const dispatch = useAppDispatch()

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value)
    setIsTyping(true)
  }
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (value) {
      MessagesController
        .create({ desc: value, recipient_id: channelId })
        .then((msg) => {
          dispatch(mapMessage({ ...msg, recipientId: channelId }))
        }, nilFunc)
      setValue('')
    }
  }

  useEffect(
    () => {
      let resetTyping: NodeJS.Timer

      if (isTyping && cable) {
        if (!channelRef.current) {
          channelRef.current = cable.subscribe(new ChatsChannel())
        }
        channelRef.current?.typing(channelId).then(nilFunc, nilFunc)
        resetTyping = setTimeout(() => { setIsTyping(false) }, 15000)
      }
      return () => {
        clearTimeout(resetTyping)
        channelRef.current?.leave()
      }
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
          onBlur: () => { setIsTyping(false) },
        }}
        label={{ val: 'Message', className: 'hidden' }}
      />
      <button type="submit" title="Send">
        <Send />
      </button>
    </form>
  )
}

export default Composer
