import ApplicationController from './applicationController'
import { Axios } from '../helpers/requests'

export default class UsersController extends ApplicationController {
  static people(page: number) {
    return new Promise<People>((resolve, reject) => {
      Axios
        .get(process.env.REACT_APP_BLUECH_RB_API_PEOPLE!, { ...this.authorize(), params: { page } })
        .then(({ data: { people, pagination } }) => { resolve({ people, pagination }) })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }
}
