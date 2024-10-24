import './App.css';
import React, { useState } from 'react';
import logoSimilar from './logoSimilar.svg';
import GaugeChart from 'react-gauge-chart';



function App() {
  const [ip, setIp] = useState('192.168.0.180');
  const [porta, setPorta] = useState('2112');
  const [status, setStatus] = useState('');

  const [vazaoMassica, setVazaoMassica] = useState(null);
  const [vazaoVolumetrica, setVazaoVolumetrica] = useState(null);
  const [volumeTotal, setVolumeTotal] = useState(null);
  const [centroGravidade, setCentroGravidade] = useState(null);


  const conectar = async () => {
    const response = await window.electronAPI.connectToRemote(ip, porta);
    setStatus(response);
  };

  const mandaRequest = async (mensagem) => {
    console.log('mandando request...');
    try{
      let response = await window.electronAPI.sendRequest(mensagem);
      if (response) {
        console.log(response);
        return response
      } else{
        console.error('sem resposta....');
        return 'sem resposta...';
      }
    } catch (error) {
      console.error('erro ao mandar request: ', error);
      return 'erro ao mandar request';
    }
  };

  const conectaYmandaRequests = async () => {
    try{
      await conectar();
    }catch (error) {
      console.error('impossivel conectar: ', error);
      return 'erro ao conectar';
    }
    while (true){
      try{
        let rvazaoMassica = await mandaRequest('sRN mvMassFlow')
        setVazaoMassica(rvazaoMassica.toFixed(3))
        console.log('vazao massica: ', rvazaoMassica);
      }catch (error) {
        console.log('nao foi possivel enviar/receber a vazao massica: ', error);
      }

      let rvazaoVolumetrica = await mandaRequest('sRN mvVolumeFlow')
      setVazaoVolumetrica(rvazaoVolumetrica.toFixed(3))
      console.log('vazao volumetrica: ', rvazaoVolumetrica.toFixed(3));

      let rvolumeTotal = await mandaRequest('sRN mvVolumeSum')
      setVolumeTotal(rvolumeTotal.toFixed(3));
      console.log('volume total: ', rvolumeTotal);    

      
      let rcentroGravidade = await mandaRequest('sRN mvGravity')
      setCentroGravidade(rcentroGravidade.toFixed(3));
      console.log('centro gravitacional: ', rcentroGravidade);
    }    
  }



  return (
    <>
      <img alt="logo" className="logo" src={logoSimilar} />
      <div className="App">Sistema de medição de volume</div>

      <label id ='dashboard-conatainer'>
        <h1 id='titulo'>Sistema de medição de volume</h1>
      </label>
      
      <label id='input-container'>
        <div className='input-row'>
          
          <label>Ip:</label>
          <input name = 'ip' defaultValue={ip} onChange={(e) => setIp(e.target.value)} />
        </div>
        <div className='input-row'>
          <label>Porta:</label>
          <input name='porta' defaultValue={porta} onChange={(e) => setPorta(e.target.value)} />
        </div>

        <button id='botaoConecta' onClick={conectaYmandaRequests}>conectar</button>
        
        <p id='status'>{status}</p>
      </label>
      <div className="dashboard-container">
        <div className="dashboard">
          <div className="dashboard-item">
            <h3>Vazão Mássica</h3>
            <GaugeChart 
              id="gauge1" 
              nrOfLevels={30} 
              arcsLength={[0.2, 0.8]} 
              colors={['#FF0000', '#00FF00']} 
              percent={vazaoMassica / 100} // Ajuste a escala conforme necessário
              textColor="#000"
            />
            <p>{vazaoMassica !== null ? vazaoMassica : 'N/A'}</p>
          </div>
          <div className="dashboard-item">
            <h3>Vazão Volumétrica</h3>
            <GaugeChart 
              id="gauge2" 
              nrOfLevels={30} 
              arcsLength={[0.2, 0.8]} 
              colors={['#FF0000', '#00FF00']} 
              percent={vazaoVolumetrica / 100} // Ajuste a escala conforme necessário
              textColor="#000"
            />
            <p>{vazaoVolumetrica !== null ? vazaoVolumetrica : 'N/A'}</p>
          </div>
          <div className="dashboard-item">
            <h3>Volume Total</h3>
            <GaugeChart 
              id="gauge3" 
              nrOfLevels={30} 
              arcsLength={[0.2, 0.8]} 
              colors={['#FF0000', '#00FF00']} 
              percent={volumeTotal} // Ajuste a escala conforme necessário
              textColor="#000"
            />
            <p>{volumeTotal !== null ? volumeTotal : 'N/A'}</p>
          </div>
          <div className="dashboard-item">
            <h3>Centro de Gravidade</h3>
            <p>{centroGravidade !== null ? centroGravidade : 'N/A'}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;