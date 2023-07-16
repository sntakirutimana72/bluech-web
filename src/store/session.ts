export default class Session {
  protected static readonly STORE_KEY = process.env.REACT_APP_BLUECH_RB_API_AUTH_TOKEN_KEY!

  static persist(token: string) {
    localStorage.setItem(this.STORE_KEY, token)
  }

  static fetch(): string | null {
    return localStorage.getItem(this.STORE_KEY)
  }

  static destroy() {
    localStorage.removeItem(this.STORE_KEY)
  }
}
