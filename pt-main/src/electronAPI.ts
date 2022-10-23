import {shell} from 'electron';
import path from 'path';


export class electronAPI {
  static store;

  static async import(event, origin: string, pathname: string) {
    if (navigator.userAgentData.platform == 'Windows') {
      return shell.openPath(path.join(origin, pathname));
    } else if (navigator.userAgentData.platform == 'MacOS') {
      const url = new URL(origin);
      url.pathname = pathname;
      return shell.openPath(url.href);
    } else {
      console.log('其他平台', navigator.userAgentData.platform);
    }
  }

  static async store_get(event, key: string, defaultValue = undefined) {
    return this.store.get(key, defaultValue);
  }

  static async store_set(event, key: string, value) {
    return this.store.set(key, value);
  }
}
