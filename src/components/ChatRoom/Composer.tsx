import React, { useEffect, useState } from "react"
import { Send } from "@mui/icons-material"
import { useCable } from '../../hooks'
import { mapMessage } from "../../redux/features/chatsSlice"
import { ChatsChannel } from '../../channels'
import { MessagesController } from "../../controllers/v1"
import { Text } from "../Elements"

type Props = React.HTMLProps<HTMLFormElement> & {
  partnerId: AlphaNumeric
  currentUser: CurrentUser
}

const Composer = ({ partnerId, currentUser, ...props }: Props) => {
  const [value, setValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { cable } = useCable()
  const { id, name } = currentUser

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value)
    setIsTyping(true)
  }
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (value.length) {
      MessagesController
        .create({ desc: value, recipient_id: partnerId })
        .then(mapMessage, (err) => { console.log(err) })
      setValue('')
    }
  }

  useEffect(
    () => {
      let resetTyping: NodeJS.Timer

      if (isTyping && cable) {
        const channel = cable.subscribe(new ChatsChannel({ id, name }))
        channel
          .typing(partnerId)
          .then(() => {}, () => {})
        resetTyping = setTimeout(() => { setIsTyping(false) }, 15000)
      }
      return () => { resetTyping && clearTimeout(resetTyping) }
    },
    [ isTyping, partnerId, cable, id, name ]
  )

  return (
    <form onSubmit={onSubmit} {...props}>
      <Text
        input={{
          id: "chats_channel_#{partner}",
          name: "message",
          placeholder: 'Enter Message',
          value,
          onChange,
          onBlur: () => { setIsTyping(false) }
        }}
        label={{ val: null, className: 'hide' }}
      />
      <button type="submit">
        <Send />
      </button>
    </form>
  )
}

export default Composer
