import {app, BrowserWindow, ipcMain, shell, webContents} from 'electron';
import {electronAPI} from './electronAPI';
import path from 'path';
import {autoUpdater} from 'electron-updater';
import Store from 'electron-store';
import {SSH} from './ssh';
import {UserSSHConfig} from './interface';

import {Cookie} from "tough-cookie";

const checkForUpdates = autoUpdater.checkForUpdatesAndNotify({
  title: '{appName} 已准备好更新',
  body: '新版本 {version} 已下载，将在程序退出后安装。',
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
const ssh = new SSH();

// @ts-ignore
const qBittorrentOrigin = store.get('qbInfo', {qb_url: 'http://localhost:8080'}).qb_url || 'http://localhost:8080';
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure', qBittorrentOrigin);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
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
    const cookies = details.responseHeaders["set-cookie"];
    if (cookies) {
      for (const [i, item] of cookies.entries()) {
        const cookie = Cookie.parse(item);
        cookie.sameSite = 'None'
        cookie.secure = true;
        cookies[i] = cookie.toString();
      }
    }
    callback({responseHeaders: details.responseHeaders});
  });

  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:4200');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'pt-web/index.html'));
  }

}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(async () => {
  electronAPI.store = store;
  ipcMain.handle('import', electronAPI.import.bind(electronAPI));
  ipcMain.handle('store_get', electronAPI.store_get.bind(electronAPI));
  ipcMain.handle('store_set', electronAPI.store_set.bind(electronAPI));
  ipcMain.handle('create_ssh', async () => ssh.createConnect());
  // ipcMain.handle('create_ssh', () =>webContents.getFocusedWebContents().send('get_file_progress', {progress: 0}));
  ipcMain.handle('get_file', async (event, infoHash, fileName) => {
    const sshConfig = electronAPI.store.get('sshConfig') as UserSSHConfig;
    const remotePath = path.posix.join(sshConfig.remotePath.split(':').at(-1), fileName);
    const localPath = path.join(sshConfig.localPath, fileName);
    await ssh.getFile(remotePath, localPath, infoHash);
  });
  ipcMain.handle('relaunch', () => {
    app.relaunch();
    app.exit();
  });

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
