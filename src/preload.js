console.log('preload carregado');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    connectToRemote: (ip, port) => ipcRenderer.invoke('connect-to-remote', ip, port),
    sendRequest: (message) => ipcRenderer.invoke('send-request', message),
});

