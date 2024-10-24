import './App.css';
import React, { useEffect, useState } from 'react';
import logoSimilar from './logoSimilar.svg';
import GaugeChart from 'react-gauge-chart';
import { CartesianGrid, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


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
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={[{ name: 'Vazão Mássica', valor: vazaoMassica || 0 }]} // Array de um único valor
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
            <p>{vazaoMassica !== null ? vazaoMassica : 'N/A'}</p>
          </div>
          <div className="dashboard-item">
            <h3>Vazão Volumétrica</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={[{ name: 'Vazão Volumétrica', valor: vazaoVolumetrica || 0 }]} // Array de um único valor
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
            <p>{vazaoVolumetrica !== null ? vazaoVolumetrica : 'N/A'}</p>
          </div>
          <div className="dashboard-item">
            <h3>Volume Total</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={[{ name: 'Volume Total', valor: volumeTotal || 0 }]} // Array de um único valor
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
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