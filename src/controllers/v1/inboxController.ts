import { Axios } from '@/helpers/requests'
import ApplicationController from '../applicationController'

export default class InboxController extends ApplicationController {
  static preview() {
    return new Promise<InboxPreview[]>((resolve, reject) => {
      Axios
        .get(process.env.REACT_APP_API_V1_INBOX!, this.authorize())
        .then(({ data: { previews } }) => { resolve(previews) })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }
}
