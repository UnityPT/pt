const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  download: (torrentId) => ipcRenderer.invoke('download', torrentId),
  list: () => ipcRenderer.invoke('list'),
  import: (torrent) => ipcRenderer.invoke('import', torrent),
});
