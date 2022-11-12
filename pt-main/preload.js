const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  import: (origin, pathname, platform) => ipcRenderer.invoke('import', origin, pathname, platform),
  store_get: (key, defaultValue) => ipcRenderer.invoke('store_get', key, defaultValue),
  store_set: (key, value) => ipcRenderer.invoke('store_set', key, value),
  create_ssh: (cfg) => ipcRenderer.invoke('create_ssh', cfg),
  get_file: (remotePath, localPath) => ipcRenderer.invoke('get_file', remotePath, localPath),
  relaunch: () => ipcRenderer.invoke('relaunch'),
});
