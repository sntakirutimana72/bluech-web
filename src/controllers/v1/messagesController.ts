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

  static conversation(params: ConvoParams) {
    return new Promise<Conversation>((resolve, reject) => {
      Axios
        .get(process.env.REACT_APP_BLUECH_RB_API_V1_MESSAGES!, { ...this.authorize(), params })
        .then(({ data: { chats, pagination } }) => {
          resolve({ chats, pagination })
        })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }
}
