import ApplicationController from '../applicationController'
import { Axios } from '../../helpers/requests'

type NewMessage = {
  desc: string
  recipient_id: AlphaNumeric
}

export default class MessagesController extends ApplicationController {
  static create(message: NewMessage) {
    return new Promise<CableMessage>((resolve, reject) => {
      Axios
        .post(process.env.REACT_APP_BLUECH_RB_API_V1_MESSAGES!, { message }, this.authorize())
        .then(({ data: { message } }) => { resolve(message) })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }

  static inbox() {
    return new Promise<InboxPreview[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 2,
            unreadCount: 4,
            preview: 'Hi! It has been a while. What ve you been up to?',
          }, {
            id: 3,
            unreadCount: 1,
            preview: 'Hello!',
          }, {
            id: 6,
            unreadCount: 0,
            preview: 'Johny suggested meeting, that you might be interested',
          }, {
            id: 8,
            unreadCount: 0,
            preview: 'Ping me when you check in, it is urgent.',
          }, {
            id: 11,
            unreadCount: 8,
            preview: 'Where that fck are you? you are so dead this time.',
          }, {
            id: 17,
            unreadCount: 60,
            preview: 'Hey! How are you? Can we meet today?',
          },
        ])
      }, 4000)
    })
  }

  static all() {
    return new Promise<CableMessage[]>((resolve, reject) => {
      Axios
        .get(process.env.REACT_APP_BLUECH_RB_API_V1_MESSAGES!, this.authorize())
        .then(({ data: { messages } }) => { resolve(messages) })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }
}
