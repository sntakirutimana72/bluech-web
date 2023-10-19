const routes = {
  ANY: '*',
  ACCOUNT: 'users/account',
  LOGOUT: 'users/logout',
  home: {
    INDEX: 'dashboard',
    PEOPLE: 'people',
    CHATROOM: 'chats/:channelId',
    SEARCH: 'search',
  },
  LOGIN: 'users/login',
  REGISTER: 'users/register',
  LANDING: '',
}

export const urls = {
  LOGOUT: `/${routes.LOGOUT}`,
  ACCOUNT: `/${routes.ACCOUNT}`,
  HOME: `/${routes.home.INDEX}`,
  PEOPLE: `/${routes.home.INDEX}/${routes.home.PEOPLE}`,
  chatroom(channelId: string) {
    return `${this.HOME}/chats/${channelId}`
  },
  SEARCH: `/${routes.home.INDEX}/${routes.home.SEARCH}`,
  LOGIN: `/${routes.LOGIN}`,
  REGISTER: `/${routes.REGISTER}`,
  LANDING: `/${routes.LANDING}`,
}

export default routes
