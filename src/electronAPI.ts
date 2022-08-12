import {shell} from 'electron';

export class electronAPI {
  static async import(event, path: string) {
    return shell.openPath(path);
  }
}
