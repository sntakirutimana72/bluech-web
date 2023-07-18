import { isAxiosError, AxiosError } from 'axios';
import SessionStore from '../store/session';

export type Resolve<T> = (param: PromiseLike<T> | T) => void
export type Reject = (reason?: any) => void
type ApiError = { error: string }

export default class ApplicationController {
  protected static authorize() {
    return {
      headers: {
        Authorization: SessionStore.fetch()!,
      },
    };
  }

  protected static reject(error: Error | AxiosError<ApiError>, reject: Reject) {
    if (isAxiosError(error)) {
      reject(error.response?.data.error);
    } else {
      reject(error.message);
    }
  }
}
