import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { electronAPI } from './electronAPI';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';
import { SSH } from './ssh';
import { Cookie } from 'tough-cookie';
import { Webdav } from './webdav';
import { SMB } from './smb';

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
const webdav = new Webdav();
const smb = new SMB();
// @ts-ignore
const protocol = store.get('qbConfig', {}).protocol;

// @ts-ignore
const qBittorrentOrigin = store.get('qbConfig', { qb_url: 'http://localhost:8080' }).qb_url || 'http://localhost:8080';
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
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (new URL(url).origin !== new URL(mainWindow.webContents.getURL()).origin) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  const qbUrl = new URL('*', qBittorrentOrigin);
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders({ urls: [qbUrl.href] }, (details, callback) => {
    delete details.requestHeaders.Origin;
    delete details.requestHeaders.Referer;
    callback({ requestHeaders: details.requestHeaders });
  });
  mainWindow.webContents.session.webRequest.onHeadersReceived({ urls: [qbUrl.href] }, (details, callback) => {
    const cookies = details.responseHeaders['set-cookie'];
    if (cookies) {
      for (const [i, item] of cookies.entries()) {
        const cookie = Cookie.parse(item);
        cookie.sameSite = 'None';
        cookie.secure = true;
        cookies[i] = cookie.toString();
      }
    }
    callback({ responseHeaders: details.responseHeaders });
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
  ipcMain.handle("smb_browse",async () => smb.smbBrowse());
  ipcMain.handle('get_list', async (event, path, type) => {
    return {
      webdav: webdav.getList.bind(webdav),
      sftp: ssh.getList.bind(ssh),
      smb: smb.getList.bind(smb),
    }[protocol](path, type);
  });
  ipcMain.handle('get_file', async (event, infoHash, fileName) => {
    return {
      webdav: webdav.getFile.bind(webdav),
      sftp: ssh.getFile.bind(ssh),
      smb: smb.getFile.bind(smb),
    }[protocol](infoHash, fileName);
  });
  ipcMain.handle('upload_file', async (event, path) => {
    return {
      webdav: webdav.uploadFile.bind(webdav),
      sftp: ssh.uploadFile.bind(ssh),
      smb: smb.uploadFile.bind(smb),
    }[protocol](path);
  });
  ipcMain.handle('create_torrent', async (event, path, options) => {
    return {
      webdav: webdav.createTorrent.bind(webdav),
      sftp: ssh.createTorrent.bind(ssh),
      smb: smb.createTorrent.bind(smb),
    }[protocol](path, options);
  });
  ipcMain.handle('extra_field', async (event, path) => {
    return {
      webdav: webdav.extraField.bind(webdav),
      sftp: ssh.extraField.bind(ssh),
      smb: smb.extraField.bind(smb),
    }[protocol](path);
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
