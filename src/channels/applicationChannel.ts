import { Channel } from "@anycable/web"
import { ChannelEvents, MessageMeta } from '@anycable/core'
import { ChannelParamsMap } from '@anycable/core/channel'

type ChannelParams = ChannelParamsMap & CableMessageAuthor & {
  channel_id?: AlphaNumeric
}

type ChannelMessage = {
  type: 'typing' | 'message'
  [key: string]: any
}

export type TypingMessage = ChannelMessage & {
  author: CableMessageAuthor
}

export type ChatMessage = ChannelMessage & {
  message: CableMessage
}

interface Events extends ChannelEvents<any> {
  typing: (msg: TypingMessage, meta?: MessageMeta) => void
  message: (msg: ChatMessage, meta?: MessageMeta) => void
}

export default class ApplicationChannel extends Channel<ChannelParams,any,Events> {
  async typing(channel: AlphaNumeric) {
    return this.perform('typing', {
      channel,
      author: { id: this.params.id, name: this.params.name }
    })
  }

  leave() {
    return this.disconnect()
  }

  receive(message: any, meta?: MessageMeta) {
    switch (message.type) {
      case "typing":
        return this.emit('typing', message, meta)
      case "message":
        return this.emit('message', message, meta)
      default:
        super.receive(message, meta)
    }
  }
}
