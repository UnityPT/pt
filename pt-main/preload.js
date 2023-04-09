const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  import: (origin, pathname, platform) => ipcRenderer.invoke('import', origin, pathname),
  store_get: (key, defaultValue) => ipcRenderer.invoke('store_get', key, defaultValue),
  store_set: (key, value) => ipcRenderer.invoke('store_set', key, value),
  get_list: (path, type) => ipcRenderer.invoke('get_list', path, type),
  get_file: (infoHash, fileName) => ipcRenderer.invoke('get_file', infoHash, fileName),
  upload_file: (path, filename) => ipcRenderer.invoke('upload_file', path, filename),
  delete_file: (path) => ipcRenderer.invoke('delete_file', path),
  connect_test: (protocol, config) => ipcRenderer.invoke('connect_test', protocol, config),
  create_torrent: (path, options) => ipcRenderer.invoke('create_torrent', path, options),
  smb_browse: () => ipcRenderer.invoke('smb_browse'),
  extra_field: (path) => ipcRenderer.invoke('extra_field', path),
  url_pathname: (url) => ipcRenderer.invoke('new_url', url),
  relaunch: () => ipcRenderer.invoke('relaunch'),
  //以下是main发web收的
  //接受main发来的消息
  // onUpdateCounter: (func) => ipcRenderer.on('update-counter', func),
  on: (channel, func) => ipcRenderer.on(channel, func),
});
