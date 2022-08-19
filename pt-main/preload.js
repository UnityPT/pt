const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  import: (path) => ipcRenderer.invoke('import', path),
});
