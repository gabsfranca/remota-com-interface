const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const TcpClient = require('./src/tcpClient.js');

let client;

function createWindow() {
    const win = new BrowserWindow({
        fullscreen: true,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, './src/preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    win.loadURL('http://localhost:3000');
}

ipcMain.handle('connect-to-remote', async (envent, ip, port) => {
    client = new TcpClient(ip, port);
    try {
        await client.conecta();
        console.log('conectado com sucesso');
        return 'conectado com sucesso';
    }catch(error) {
        console.error('erro na conexao: ', error);
        return 'erro na conexao';
    }
});

ipcMain.handle('send-request', async (event, message) => {
    if (!client) {
        console.log('erro ao enviar mensagem');
        return 'erro ao enviar mensagem';
    }

    try {
        await client.mandaRequest(message);
        const response = await client.recebeYconverte('', message);
        return response;
    } catch (error) {
        console.log('erro ao enviar request: ', error);
        return 'erro ao enviar request';
    }
});


app.whenReady().then(() => {
    createWindow();

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});