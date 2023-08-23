import ApplicationController from '../applicationController'
import { Axios } from '../../helpers/requests'

export default class InboxController extends ApplicationController {
  static preview() {
    return new Promise<InboxPreview[]>((resolve, reject) => {
      Axios
        .get(process.env.REACT_APP_BLUECH_RB_API_INBOX!, this.authorize())
        .then(({ data: { previews } }) => { resolve(previews) })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }
}
