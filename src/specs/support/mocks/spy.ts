export default class Spy {
  static resolved(obj: any, method: string, resolveValue?: { [key: string]: any }) {
    return jest.spyOn(obj, method).mockResolvedValue(resolveValue)
  }

  static rejected(obj: any, method: string, rejectValue?: any) {
    return jest.spyOn(obj, method).mockRejectedValue(rejectValue)
  }
}
