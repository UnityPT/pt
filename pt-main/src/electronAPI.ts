import { shell } from 'electron';
import path from 'path';
import * as fs from 'fs';

export class electronAPI {
  static store;

  static async import(event, origin: string, pathname: string) {
    const platform = process.platform;
    if (platform == 'win32') {
      return shell.openPath(path.join(origin, pathname));
    } else if (platform == 'darwin') {
      const url = new URL(origin);
      url.pathname = path.join(url.pathname, pathname);
      return shell.openExternal(url.href);
    } else {
      console.log('其他平台', platform);
      return shell.openExternal(path.join(origin, pathname));
    }
  }

  static async store_get(event, key: string, defaultValue = undefined) {
    return this.store.get(key, defaultValue);
  }

  static async store_set(event, key: string, value) {
    return this.store.set(key, value);
  }
}
