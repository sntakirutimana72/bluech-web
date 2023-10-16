const routes = {
  ANY: '*',
  LOGOUT: 'users/logout',
  home: {
    INDEX: 'dashboard',
    PEOPLE: 'people',
    CHATROOM: 'chats/:channelId',
  },
  LOGIN: 'users/login',
  REGISTER: 'users/register',
  LANDING: '',
}

export const urls = {
  LOGOUT: `/${routes.LOGOUT}`,
  HOME: `/${routes.home.INDEX}`,
  PEOPLE: `/${routes.home.INDEX}/${routes.home.PEOPLE}`,
  chatroom(channelId: string) {
    return `${this.HOME}/chats/${channelId}`
  },
  LOGIN: `/${routes.LOGIN}`,
  REGISTER: `/${routes.REGISTER}`,
  LANDING: `/${routes.LANDING}`,
}

export default routes
