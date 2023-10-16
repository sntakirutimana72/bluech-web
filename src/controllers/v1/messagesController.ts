import { Axios } from '@/helpers/requests'
import ApplicationController from '../applicationController'

type NewMessage = {
  desc: string
  recipient_id: AlphaNumeric
}

export default class MessagesController extends ApplicationController {
  static create(message: NewMessage) {
    return new Promise<CableMessage>((resolve, reject) => {
      Axios
        .post(process.env.REACT_APP_API_V1_MESSAGES!, { message }, this.authorize())
        .then(({ data: { message } }) => { resolve(message) })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }

  static conversation(convo: ConvoParams) {
    return new Promise<Conversation>((resolve, reject) => {
      Axios
        .get(process.env.REACT_APP_API_V1_MESSAGES!, {
          ...this.authorize(), params: { convo },
        })
        .then(({ data: { chats, pagination } }) => {
          resolve({ chats, pagination })
        })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }

  static markAsRead(convo: MarkAsReadParams) {
    return new Promise<string[]>((resolve, reject) => {
      Axios
        .patch(process.env.REACT_APP_API_V1_MARKED_AS_READ!, {
          ...this.authorize(), params: { convo },
        })
        .then(({ data: { ids } }) => { resolve(ids) })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }
}
