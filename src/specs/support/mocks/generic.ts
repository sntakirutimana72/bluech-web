export default class Generic {
  static currentUser(): CurrentUser {
    return {
      id: 80,
      email: 'tmp-user@email.com',
      name: 'tmp-user',
    }
  }

  static personnel(id: AlphaNumeric): Personnel {
    return {
      id,
      name: 'tmp-personnel',
      bio: "Hey there! I'm using bluech",
    }
  }

  static paginate(): Pagination {
    return {
      current: 1,
      pages: 2,
    }
  }

  static newUser(): NewUser {
    return {
      email: 'tmp-user@email.com',
      name: 'tmp-user',
      password: '',
    }
  }

  static cableMessage(id: AlphaNumeric, authorId: AlphaNumeric): CableMessage {
    return {
      id,
      desc: 'SOME_MSG_DESC',
      is_edited: false,
      creation_date: new Date(),
      last_update: null,
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
      unread: 0,
      creation_date: new Date(),
    }
  }
}
