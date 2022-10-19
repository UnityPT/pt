import {shell} from 'electron';


export class electronAPI {
  static store;

  static async import(event, path: string) {
    console.log(path);
    return shell.openPath(path);
  }

  static async store_get(event, key: string, defaultValue = undefined) {
    return this.store.get(key, defaultValue);
  }

  static async store_set(event, key: string, value) {
    return this.store.set(key, value);
  }
}
