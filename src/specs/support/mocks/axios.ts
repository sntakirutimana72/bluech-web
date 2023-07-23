import { Axios } from '../../../helpers/requests'

type AllowedMethods = 'head' | 'get' | 'post' | 'delete'
type Response = { [key: string]: any }

export default class AxiosMocker {
  protected static spyware(method: AllowedMethods) {
    return jest.spyOn(Axios, method)
  }

  static resolved(method: AllowedMethods, response: Response) {
    const mocker = this.spyware(method)
    mocker.mockResolvedValue(response)
    return mocker
  }

  static rejected(method: AllowedMethods, response: Response) {
    const mocker = this.spyware(method)
    mocker.mockRejectedValue(response)
    return mocker
  }
}
