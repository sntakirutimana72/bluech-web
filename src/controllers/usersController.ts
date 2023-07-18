import ApplicationController from "./applicationController"

export default class UsersController extends ApplicationController {
  static people(page: number) {
    return new Promise<PeopleObj[]>((resolve) => {
      setTimeout(() => {
        const origin = 25 * (page - 1)
        resolve([
          {
            id: 1,
            name: 'sntakirutimana72',
            bio: 'Hey there!'
          }, {
            id: 2,
            name: 'lionel25',
            bio: "Hey there! I'm using bluech"
          }, {
            id: 3,
            name: 'lionel35',
            bio: "Hey there! I'm using bluech"
          }, {
            id: 4,
            name: 'lionel45',
            bio: "Hey there! I'm using bluech"
          }, {
            id: 5,
            name: 'lionel55',
            bio: "Hey there! I'm using bluech"
          }, {
            id: 6,
            name: 'lionel65',
            bio: "Hey there! I'm using bluech"
          }, {
            id: 7,
            name: 'lionel75',
            bio: "Hey there! I'm using bluech"
          }, {
            id: 8,
            name: 'lionel85',
            bio: "Hey there! I'm using bluech"
          }, {
            id: 9,
            name: 'lionel95',
            bio: "Hey there! I'm using bluech"
          }, {
            id: 10,
            name: 'lionel105',
            bio: "Hey there! I'm using bluech"
          },
        ].slice(origin, origin + 25))
      }, 4000)
    })
  }
}
