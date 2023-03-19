const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  import: (origin, pathname, platform) => ipcRenderer.invoke('import', origin, pathname, platform),
  store_get: (key, defaultValue) => ipcRenderer.invoke('store_get', key, defaultValue),
  store_set: (key, value) => ipcRenderer.invoke('store_set', key, value),
  create_ssh: () => ipcRenderer.invoke('create_ssh'),
  get_list: () => ipcRenderer.invoke('get_list'),
  get_file: (infoHash, fileName) => ipcRenderer.invoke('get_file', infoHash, fileName),
  relaunch: () => ipcRenderer.invoke('relaunch'),
  //以下是main发web收的
  //接受main发来的消息
  // onUpdateCounter: (func) => ipcRenderer.on('update-counter', func),
  on: (channel, func) => ipcRenderer.on(channel, func),
  // on: (event, func) => {
  //   const validEvents = ['get_file_progress'];
  //   if (validEvents.includes(event)) {
  //     ipcRenderer.on(event, (event, data) => func(data));
  //   } else {
  //     console.log('invalid channel');
  //   }
  // },
});
