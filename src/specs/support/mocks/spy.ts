export default class Spy {
  static agent(obj: any, method: string) {
    return jest.spyOn(obj, method)
  }

  static resolved(obj: any, method: string, resolveValue?: { [key: string]: any }) {
    return this.agent(obj, method).mockResolvedValue(resolveValue)
  }

  static rejected(obj: any, method: string, rejectValue?: any) {
    return this.agent(obj, method).mockRejectedValue(rejectValue)
  }

  static returned(obj: any, method: string, returnValue?: any) {
    return this.agent(obj, method).mockReturnValue(returnValue)
  }
}
