export default class LocalStorage {
  protected static items: { [key: string]: string, } = {};

  static setItem(key: string, value: string) {
    this.items[key] = value;
  }

  static getItem(key: string): string | null {
    const res = this.items[key];
    return res === undefined ? null : res;
  }

  static removeItem(key: string) {
    delete this.items[key];
  }

  static getAll() {
    return { ...this.items };
  }

  static clear() {
    this.items = {};
  }
}
