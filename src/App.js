import './App.css';
import React, { useState } from 'react';
import logoSimilar from './logoSimilar.svg';
import { CartesianGrid, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [ip, setIp] = useState('192.168.0.180');
  const [porta, setPorta] = useState('2112');
  const [status, setStatus] = useState('');
  const [densidade, setDensidade] = useState('');

  const [vazaoMassica, setVazaoMassica] = useState([]);
  const [vazaoVolumetrica, setVazaoVolumetrica] = useState([]);
  const [volumeTotal, setVolumeTotal] = useState([]);
  const [centroGravidade, setCentroGravidade] = useState(null);

  let coletaInterval = null;

  const conectar = async () => {
    const response = await window.electronAPI.connectToRemote(ip, porta);
    setStatus(response);
  };

  const mandaRequest = async (mensagem) => {
    try {
      console.log('enviando msg: ', mensagem);
      let response = await window.electronAPI.sendRequest(mensagem);
      if (response) {
        return response;
      } else {
        return 'sem resposta...';
      }
    } catch (error) {
      return 'erro ao mandar request';
    }
  };

  const conectaYmandaRequests = async () => {
    try {
      await conectar();
    } catch (error) {
      console.error('impossivel conectar: ', error);
      return 'erro ao conectar';
    }

    if (coletaInterval) clearInterval(coletaInterval); // Limpa o intervalo existente para evitar múltiplas chamadas

    const coletaDados = async () => {
      const timestamp = new Date().toLocaleTimeString();

      try {
        const rvazaoMassica = await mandaRequest('sRN mvMassFlow');
        const valorMassica = isNaN(Number(rvazaoMassica)) ? 0 : parseFloat(Number(rvazaoMassica).toFixed(3));
        setVazaoMassica((prev) => [
          ...prev.slice(-1200),
          { time: timestamp, valor: valorMassica }
        ]);

        const rvazaoVolumetrica = await mandaRequest('sRN mvVolumeFlow');
        const valorVolumetrico = isNaN(Number(rvazaoVolumetrica)) ? 0 : parseFloat(Number(rvazaoVolumetrica).toFixed(3));
        setVazaoVolumetrica((prev) => [
          ...prev.slice(-1200),
          { time: timestamp, valor: valorVolumetrico }
        ]);

        const rvolumeTotal = await mandaRequest('sRN mvVolumeSum');
        const valorVolumeTotal = isNaN(Number(rvolumeTotal)) ? 0 : parseFloat(Number(rvolumeTotal).toFixed(3));
        setVolumeTotal((prev) => [
          ...prev.slice(-1200),
          { time: timestamp, valor: valorVolumeTotal }
        ]);

        const rcentroGravidade = await mandaRequest('sRN mvGravity');
        const valorCentroGravidade = isNaN(Number(rcentroGravidade)) ? 0 : parseFloat(Number(rcentroGravidade).toFixed(3));
        setCentroGravidade(valorCentroGravidade);
      } catch (error) {
        console.error(`Erro na coleta de dados: ${error}`);
      }
    };

    coletaInterval = setInterval(coletaDados, 2000);
    coletaDados();
  };

  const alteraDensidade = async (dens) =>{
    if (isNaN(dens) || dens <= 0){
      console.log('insira um valor valido');
      return 'insira um valor valido'
    }
    try{
      console.log('tentando alterar densidade: ', dens);
      const msg = `sWN parFixedDensity +${dens}`
      await mandaRequest(msg);
      setDensidade(dens);
    }catch (error){
      console.error('erro: ', error);
      return 'erro ao alterar densidade'
    }

    console.log('densidade alterada!');
  }

  return (
    <>
      <img alt="logo" className="logo" src={logoSimilar} />
      <div className="App">Sistema de medição de volume</div>

      <label id="dashboard-container">
        <h1 id="titulo">Sistema de medição de volume</h1>
      </label>

      <label id="input-container">
        <div className="input-row">
          <label>Ip:</label>
          <input name="ip" defaultValue={ip} onChange={(e) => setIp(e.target.value)} />
        </div>
        <div className="input-row">
          <label>Porta:</label>
          <input name="porta" defaultValue={porta} onChange={(e) => setPorta(e.target.value)} />
        </div>

        <button id="botaoConecta" onClick={conectaYmandaRequests}>Conectar</button>
        
        <p id="status">{status}</p>

        <div className="input-densidade">
          <label>Densidade:</label>
          <input name="densidade" onChange={(e) => setDensidade(e.target.value)} />
        </div>
        <button id="botaoDensidade" onClick={() => alteraDensidade(densidade)}>Alterar densidade</button>
      </label>

      <div className="dashboard-container" height={500}>
        <div className="dashboard" height={500}>
          <div className="dashboard-item">
            <h3>Vazão Mássica</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={vazaoMassica}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-item">
            <h3>Vazão Volumétrica</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={vazaoVolumetrica}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-item">
            <h3>Volume Total</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={volumeTotal}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-item">
            <h3>Centro de Gravidade</h3>
            <div className="level-container">
              <div
                className="level-indicator"
                style={{ left: `${(centroGravidade * 100) - 4}%` }}
              ></div>
            </div>
            <p>{centroGravidade !== null ? centroGravidade.toFixed(2) : 'N/A'}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;