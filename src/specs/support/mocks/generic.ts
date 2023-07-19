export default class Generic {
  static currentUser(): CurrentUser {
    return {
      id: 80,
      email: 'tmp-user@email.com',
      name: 'mocked-user',
    }
  }

  static cableMessage(id: AlphaNumeric, authorId: AlphaNumeric): CableMessage {
    return {
      id,
      desc: 'SOME_MSG_DESC',
      is_edited: false,
      creation_date: new Date(),
      last_update: new Date(),
      author: {
        id: authorId,
        name: 'SOME_AUTHOR',
      },
    }
  }

  static inboxPreview(id: AlphaNumeric): InboxPreview {
    return {
      id,
      preview: 'SOME_PREVIEW',
      unreadCount: 0,
    }
  }
}
