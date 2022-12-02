import { app, BrowserWindow, screen, ipcMain } from 'electron'
import { resolve } from 'node:path'

let mainWindow: BrowserWindow
function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: resolve(__dirname, 'preload.js'),
    },
  })
  win.loadFile('index.html')
  mainWindow = win
}

app.whenReady().then(() => {
  ipcMain.handle('screen:getAllDisplays', () => screen.getAllDisplays())
  ipcMain.handle('screen:getAllWindows', () => {
    return BrowserWindow.getAllWindows().map((v) => ({
      id: v.id,
      ...v.getBounds(),
    }))
  })
  ipcMain.handle('window:open', (ev, options) => {
    console.log(options)
    const win = new BrowserWindow({ ...options, parent: mainWindow })
    return { id: win.id, ...win.getBounds() }
  })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
