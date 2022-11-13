const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  import: (origin, pathname, platform) => ipcRenderer.invoke('import', origin, pathname, platform),
  store_get: (key, defaultValue) => ipcRenderer.invoke('store_get', key, defaultValue),
  store_set: (key, value) => ipcRenderer.invoke('store_set', key, value),
  create_ssh: () => ipcRenderer.invoke('create_ssh'),
  relaunch: () => ipcRenderer.invoke('relaunch'),
  //以下是main发web收
  on_get_file_progress: (callback) => ipcRenderer.on('get_file_progress', callback),
});
