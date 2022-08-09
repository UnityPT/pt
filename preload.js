const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  download: (torrentId) => ipcRenderer.invoke('download', torrentId),
  list: () => ipcRenderer.invoke('list'),
  import: (torrent) => ipcRenderer.invoke('import', torrent),
  cancel: (torrent) => ipcRenderer.invoke('cancel', torrent),
  pause: (torrent) => ipcRenderer.invoke('pause', torrent),
  resume: (torrent) => ipcRenderer.invoke('resume', torrent),
});
