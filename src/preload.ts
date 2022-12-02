import { contextBridge, ipcRenderer, Rectangle } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getAllDisplays: () => ipcRenderer.invoke('screen:getAllDisplays'),
  getAllWindows: () => ipcRenderer.invoke('screen:getAllWindows'),
  openWindow: (options: Rectangle) =>
    ipcRenderer.invoke('window:open', options),
})
