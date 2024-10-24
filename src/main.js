const { ipcMain } = require('electron');
const { tcpClient } = require('./tcpClient.js');

let client;

ipcMain.handle('connect-to-remote', async (event, ip, port) => {
    const client = new tcpClient(ip, port);
    try{
        await client.conecta();
        return 'conectado';
    }catch(error) {
        console.error('erro na conexao: ', error);
        return 'erro ao conectar';
    }
});

ipcMain.handle('send-request', async (event, message) => {
    if (!client) {
        return 'erro: nao ha cliente conectado';
    }
    
    try{
        await client.mandaRequest(message);
        const response = await client.recebeYconverte('', message);
        return response;
    }catch (error) {
        console.error('erro ao enviar request: ', error);
        return 'erro ao enviar request';
    }
});