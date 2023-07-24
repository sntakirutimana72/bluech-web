import { AxiosResponse } from 'axios'
import { Axios } from '../helpers/requests'
import SessionStore from '../store/session'
import ApplicationController from './applicationController'
import type { Resolve } from './applicationController'

type CredentialsProps = Pick<NewUser, 'email' | 'password'>

export default class SessionController extends ApplicationController {
  protected static onSuccess(resp: AxiosResponse, resolve: Resolve<CurrentUser>) {
    const { data: { user }, headers: { authorization } } = resp
    SessionStore.persist(authorization)
    resolve(user)
  }

  static login(creds: CredentialsProps) {
    return new Promise<CurrentUser>((resolve, reject) => {
      Axios
        .post(process.env.REACT_APP_BLUECH_RB_API_LOGIN!, { user: creds })
        .then((resp) => { this.onSuccess(resp, resolve) })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }

  static logout() {
    return new Promise<void>((resolve) => {
      Axios
        .delete(process.env.REACT_APP_BLUECH_RB_API_LOGOUT!, this.authorize())
        .catch(() => {})
        .finally(() => {
          SessionStore.destroy()
          resolve()
        })
    })
  }

  static register(requirements: NewUser) {
    return new Promise<CurrentUser>((resolve, reject) => {
      Axios
        .post(process.env.REACT_APP_BLUECH_RB_API_REGISTER!, { user: requirements })
        .then((resp) => { this.onSuccess(resp, resolve) })
        .catch((exc) => { this.reject(exc, reject) })
    })
  }

  static signedUser() {
    return new Promise<CurrentUser>((resolve, reject) => {
      this.ensureAuthorizationExists(reject)
      Axios
        .get(process.env.REACT_APP_BLUECH_RB_API_SESSION_USER!, this.authorize())
        .then((resp) => { this.onSuccess(resp, resolve) })
        .catch(() => { this.destroyAndReject(reject) })
    })
  }

  static refresh() {
    return new Promise<void>((resolve, reject) => {
      this.ensureAuthorizationExists(reject)
      Axios
        .head(process.env.REACT_APP_BLUECH_RB_API_REFRESH_SESSION!, this.authorize())
        .then(({ headers: { authorization } }) => {
          SessionStore.persist(authorization)
          resolve()
        })
        .catch(() => { this.destroyAndReject(reject) })
    })
  }
}
