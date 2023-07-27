export default class Generic {
  static currentUser(): CurrentUser {
    return {
      id: 80,
      email: 'tmp-user@email.com',
      name: 'tmp-user',
    }
  }

  static personnel(): Personnel {
    return {
      id: 89,
      name: 'tmp-personnel',
      bio: "Hey there! I'm using bluech",
    }
  }

  static paginate(): Pagination {
    return {
      previous: null,
      current: 1,
      next: 2,
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

  static peopleObj(id: AlphaNumeric): Personnel {
    return {
      id,
      name: 'FirstPersonName',
      bio: 'SOME_BIO',
    }
  }
}
