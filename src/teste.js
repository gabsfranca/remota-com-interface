const TcpClient = require('./tcpClient.js');

teste = new TcpClient('192.168.0.180', 2112);
async function conecta() {
    try{
        await teste.conecta();
        await teste.mandaRequest('sWN parFixedDensity +1.25');
      }catch (error) {
          console.log('erro', error);
      }    
}

conecta();
