const TcpClient = require('./tcpClient.js');

teste = new TcpClient('192.168.0.180', 2112);

console.log(teste.ip);