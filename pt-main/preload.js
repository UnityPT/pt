const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  import: (origin, pathname) => ipcRenderer.invoke('import', origin, pathname),
  store_get: (key, defaultValue) => ipcRenderer.invoke('store_get', key, defaultValue),
  store_set: (key, value) => ipcRenderer.invoke('store_set', key, value)
});
