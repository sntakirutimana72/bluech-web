import { now } from '../../../helpers/utils'

export default class Generic {
  protected static msgIdCounter = 0

  protected static userIdCounter = 0

  static currentUser(): CurrentUser {
    return {
      id: ++this.userIdCounter,
      email: 'tmpUser@email.com',
      name: 'tmpUser',
    }
  }

  static personnel(id?: AlphaNumeric): Personnel {
    return {
      id: id || ++this.userIdCounter,
      name: 'tmpPersonnel',
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
      email: 'tmpUser@email.com',
      name: 'tmpUser',
      password: '',
    }
  }

  static cableMessage(id?: AlphaNumeric, authorId?: AlphaNumeric): CableMessage {
    return {
      id: id || ++this.msgIdCounter,
      desc: 'tmpDescription',
      isEdited: false,
      createdAt: now().toISOString(),
      updatedAt: null,
      author: {
        id: authorId || ++this.userIdCounter,
        name: 'tmpAuthor',
      },
    }
  }

  static inboxPreview(id?: AlphaNumeric): InboxPreview {
    return {
      id: id || ++this.userIdCounter,
      preview: 'tmpPreview',
      unread: 0,
      createdAt: now().toISOString(),
    }
  }

  static clear() {
    this.userIdCounter = 0
    this.msgIdCounter = 0
  }
}
