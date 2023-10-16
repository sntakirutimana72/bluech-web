import { Channel } from '@anycable/web'
import { ChannelEvents } from '@anycable/core'
import type { MessageMeta } from '@anycable/core'
import type { ChannelParamsMap } from '@anycable/core/channel'

type ChannelParams = ChannelParamsMap & {
  //
}

type ChannelMessage = {
  [key: string]: any
}

type TypingSignal = {
  channelId: AlphaNumeric
  status: boolean
}

export type TypingMessage = ChannelMessage & {
  type: 'typing'
  status: boolean
  author: CableMessageAuthor
}

export type ChatMessage = ChannelMessage & {
  type: 'message'
  message: CableMessage
}

export type AsSeenMessage = ChannelMessage & CableSeen & {
  type: 'read'
}

interface Events extends ChannelEvents<any> {
  typing(msg: TypingMessage, meta?: MessageMeta): void
  message(msg: ChatMessage, meta?: MessageMeta): void
  read(msg: AsSeenMessage, meta?: MessageMeta): void
}

export default class ApplicationChannel extends Channel<ChannelParams, any, Events> {
  async typing(signal: TypingSignal) {
    return this.perform('typing', signal)
  }

  leave() {
    return this.disconnect()
  }

  receive(message: any, meta?: MessageMeta) {
    switch (message.type) {
      case 'typing':
      case 'message':
      case 'read':
        return this.emit(message.type, message, meta)
      default:
        return super.receive(message, meta)
    }
  }
}
