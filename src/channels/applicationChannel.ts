import { Channel } from '@anycable/web'
import { ChannelEvents } from '@anycable/core'
import type { MessageMeta } from '@anycable/core'
import type { ChannelParamsMap } from '@anycable/core/channel'

type ChannelParams = ChannelParamsMap & CableMessageAuthor & {
  channel_id?: AlphaNumeric
}

type ChannelMessage = {
  [key: string]: any
}

export type TypingMessage = ChannelMessage & {
  type: 'typing'
  author: CableMessageAuthor
}

export type ChatMessage = ChannelMessage & {
  type: 'message'
  message: CableMessage
}

interface Events extends ChannelEvents<any> {
  typing: (msg: TypingMessage, meta?: MessageMeta) => void
  message: (msg: ChatMessage, meta?: MessageMeta) => void
}

export default class ApplicationChannel extends Channel<ChannelParams, any, Events> {
  async typing(channel: AlphaNumeric) {
    return this.perform('typing', {
      channel,
      author: { id: this.params.id, name: this.params.name },
    })
  }

  leave() {
    return this.disconnect()
  }

  receive(message: any, meta?: MessageMeta) {
    switch (message.type) {
      case 'typing':
        return this.emit('typing', message, meta)
      case 'message':
        return this.emit('message', message, meta)
      default:
        return super.receive(message, meta)
    }
  }
}
