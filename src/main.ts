import {app, BrowserWindow, ipcMain, shell} from 'electron';
import {electronAPI} from './electronAPI';
import path from 'path';
import {login} from './api';

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({url}) => {
    shell.openExternal(url);
    return {action: 'deny'};
  });

  // 加载 index.html
  mainWindow.loadURL('http://localhost:4200');

  // 打开开发工具
  mainWindow.webContents.openDevTools();
};

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  ipcMain.handle('download', electronAPI.download);
  ipcMain.handle('list', electronAPI.list);
  ipcMain.handle('import', electronAPI.import);
  ipcMain.handle('cancel', electronAPI.cancel);
  ipcMain.handle('pause', electronAPI.pause);
  ipcMain.handle('resume', electronAPI.resume);

  login('simpletracker', 'simpletracker');
  createWindow();
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
