const net = require('net');
const Conversora = require('./Conversora');

class TcpClient {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.conversora = new Conversora();
        this.conn = null;
        this.buffer = '';
        this.pendingResolve = null; // Resolver para o valor pendente
        this.pendingReject = null;  // Reject para o valor pendente
    }

    conecta() {
        return new Promise((resolve, reject) => {
            this.conn = net.createConnection({ host: this.ip, port: this.port }, () => {
                console.log('conectado!');
                resolve();
            });

            this.conn.on('error', (error) => {
                console.error('falha ao conectar: ', error);
                reject(error);
            });

            // Listener de 'data' configurado apenas uma vez
            this.conn.on('data', (data) => {
                this.buffer += data.toString(); // Concatena os dados recebidos no buffer

                if (this.pendingResolve) { // Checa se há uma promise pendente
                    const regex = new RegExp(`${this.pendingRequest}\\s+([0-9A-Fa-f]{8})`);
                    const match = this.buffer.match(regex);

                    if (match) {
                        const valorHex = match[1];
                        const valorFloat = this.conversora.hex2float(valorHex);
                        this.pendingResolve(valorFloat); // Resolve a promise pendente
                        this.pendingResolve = null;
                        this.pendingReject = null;
                        this.buffer = ''; // Limpa o buffer após processar a resposta
                    }
                }
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
            this.pendingRequest = oque;
            this.pendingResolve = resolve;
            this.pendingReject = reject;

            // Timeout para rejeitar caso não receba resposta dentro do tempo esperado
            setTimeout(() => {
                if (this.pendingReject) {
                    this.pendingReject(new Error('Timeout ao receber resposta'));
                    this.pendingResolve = null;
                    this.pendingReject = null;
                }
            }, 5000); // Ajuste o tempo de timeout conforme necessário
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
