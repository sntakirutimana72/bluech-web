import { ApplicationController } from "../applicationController"
import { Axios } from '../../helpers/requests'

type NewMessage = {
  desc: string
  recipient_id: AlphaNumeric
}

export class MessagesController extends ApplicationController {
  static create(message: NewMessage) {
    return new Promise<CableMessage>((resolve, reject) => {
      Axios
        .post(process.env.REACT_APP_BLUECH_RB_API_V1_MESSAGES!, { message }, this.authorize())
        .then(({ data: { message } }) => { resolve(message) })
        .catch(exc => { this.reject(exc, reject) })
    })
  }

  static all() {
    return new Promise<CableMessage[]>((resolve, reject) => {
      Axios
        .get(process.env.REACT_APP_BLUECH_RB_API_V1_MESSAGES!, this.authorize())
        .then(({ data: { messages } }) => { resolve(messages) })
        .catch(exc => { this.reject(exc, reject) })
    })
  }
}
