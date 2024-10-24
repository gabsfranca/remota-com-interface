const net = require('net');
const Conversora = require('./Conversora');

class TcpClient {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.conversora = new Conversora();
        this.conn = null;
    }

    conecta() {
        return new Promise((resolve, reject) => {
            this.conn = net.createConnection({ host: this.ip, port: this.port }, () => {
                console.log('+------------------------------------+');
                console.log('|            conectado!              |');
                console.log('+------------------------------------+');
                resolve();
            });

            this.conn.on('error', (error) => {
                console.error('falha ao conectar: ', error);
                reject(error);
            });
        });
    }

    mandaRequest(msg) {
        return new Promise((resolve, reject) => {
            const request = `\x02${msg}\x03`; // STX e ETX em hex
            this.conn.write(request, (error) => {
                if (error) {
                    console.error('erro mandando request: ', error);
                    return reject(error);
                }
                resolve();
            });
        });
    }

    recebeYconverte(oque) {
        return new Promise((resolve, reject) => {
            const buffer = [];
            this.conn.on('data', (data) => {
                buffer.push(data);
                const response = Buffer.concat(buffer).toString();
                // Lógica para processar a resposta como antes...
                
                const regex = new RegExp(`${oque}\\s+([0-9A-Fa-f]{8})`);
                const match = response.match(regex);

                if (match) {
                    const valorHex = match[1];
                    const valorFloat = this.conversora.hex2float(valorHex);
                    console.log(`|              ${valorFloat.toFixed(4)}               |`);
                    console.log('+------------------------------------+');
                    resolve(valorFloat); // Retorna o valor convertido
                } else {
                    console.log('num deu pra le :(');
                    reject(new Error('No match found'));
                }
            });

            this.conn.on('error', (error) => {
                console.error('erro ao receber dados: ', error);
                reject(error);
            });
        });
    }

    fechaConn() {
        return new Promise((resolve) => {
            if (this.conn) {
                this.conn.end(() => {
                    console.log('conexao fechada');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = TcpClient;
