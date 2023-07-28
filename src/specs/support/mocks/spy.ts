type Response = {
  [key: string]: any
}

export default class Spy {
  static resolved(obj: any, method: string, response: Response) {
    return jest.spyOn(obj, method).mockResolvedValue(response)
  }

  static rejected(obj: any, method: string, response?: Response) {
    return jest.spyOn(obj, method).mockRejectedValue(response)
  }
}
