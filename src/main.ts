import {app, BrowserWindow, ipcMain, shell} from 'electron';
import {electronAPI} from './electronAPI';
import path from 'path';
import {autoUpdater} from 'electron-updater';
import Store from 'electron-store';

const checkForUpdates = autoUpdater.checkForUpdatesAndNotify({
  title: '{appName} 已准备好更新',
  body: '新版本 {version} 已下载，将在程序退出后安装。'
});

// checkForUpdates.then(()=>{
//   autoUpdater.on('download-progress', (progressObj) => {
//     let log_message = "Download speed: " + progressObj.bytesPerSecond;
//     log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//     log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//     sendStatusToWindow(log_message);
//   })
// })

const isDevelopment = process.env.NODE_ENV !== 'production';

const store = new Store();
// store.set('qBittorrentOrigin', 'http://poi.lan:8080');
// if(store.get('origin'))
const qBittorrentOrigin = <string>store.get('qBittorrentOrigin') ?? 'http://localhost:8080';
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure', qBittorrentOrigin);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({url}) => {
    shell.openExternal(url);
    return {action: 'deny'};
  });
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders({urls: [qBittorrentOrigin + '/*']}, (details, callback) => {
    delete details.requestHeaders.Origin;
    delete details.requestHeaders.Referer;
    callback({requestHeaders: details.requestHeaders});
  });
  mainWindow.webContents.session.webRequest.onHeadersReceived({urls: [qBittorrentOrigin + '/*']}, (details, callback) => {
    if (details.responseHeaders['set-cookie']) {
      details.responseHeaders['set-cookie'][0] = details.responseHeaders['set-cookie'][0].replace('SameSite=Strict', 'SameSite=None; Secure');
    }
    callback({responseHeaders: details.responseHeaders});
  });

  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'pt-web/index.html'));
  }
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(async () => {
  ipcMain.handle('import', electronAPI.import);

  createWindow();
  // app.on('activate', () => {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow();
  // });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
