import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { syncDashboardStats } from '../utils/syncData';
import StatsCard from '../components/dashboard/StatsCard';
import GenderChart from '../components/dashboard/GenderChart';
import VacinasCard from '../components/dashboard/VacinasCard';
import AnimaisTable from '../components/dashboard/AnimaisTable';
import PesagensTable from '../components/dashboard/PesagensTable';


const DashboardHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalAnimais: 0,
    animaisAtivos: 0,
    totalLotes: 0,
    totalVacinas: 0,
    totalPesagens: 0,
    totalMachos: 0,
    totalFemeas: 0,
    totalFuncionarios: 0
  });
  const [animais, setAnimais] = useState([]);
  const [pesagens, setPesagens] = useState([]);
  const [vacinasData, setVacinasData] = useState([]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(currentUser));
    
    carregarDados();
  }, [navigate]);

  const carregarDados = () => {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const totalFuncionarios = funcionarios.length;
    
    const dashboardStats = syncDashboardStats();
    setStats({
      ...dashboardStats,
      totalFuncionarios
    });
    
    const storedAnimais = localStorage.getItem('animais');
    const storedPesagens = localStorage.getItem('pesagens');
    const storedVacinas = localStorage.getItem('vacinas');
    
    if (storedAnimais) {
      const animaisList = JSON.parse(storedAnimais);
      setAnimais(animaisList);
    }
    if (storedPesagens) {
      setPesagens(JSON.parse(storedPesagens));
    }
    if (storedVacinas) {
      const vacinas = JSON.parse(storedVacinas);
      setVacinasData(vacinas.slice(0, 2).map(v => ({
        nome: v.nome,
        data: v.dataAplicacao || v.data_validade,
        percentual: 100
      })));
    }
  };

  const genderData = {
    machos: stats.totalMachos,
    femeas: stats.totalFemeas
  };

  const animaisData = [...animais]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 4)
    .map(animal => ({
      identificacao: animal.nome,
      raca: animal.raca || 'Nelore',
      sexo: animal.sexo === 'Macho' ? 'Masc.' : 'Fem.',
      peso: animal.peso ? `${animal.peso} kg` : '-',
      status: animal.status || 'Ativo'
    }));

  const pesagensData = [...pesagens]
    .sort((a, b) => {
      const dataA = a.dataPesagem?.split('/').reverse().join('-');
      const dataB = b.dataPesagem?.split('/').reverse().join('-');
      return new Date(dataB) - new Date(dataA);
    })
    .slice(0, 4)
    .map(pesagem => ({
      animal: pesagem.animalNome,
      data: pesagem.dataPesagem,
      peso: `${pesagem.peso} kg`
    }));

  if (!user) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Olá {user.nome}!</h2>
        <p>Veja os detalhes de toda a sua fazenda aqui</p>
      </div>
      
      <div className="page-content">
        <div className="stats-grid">
          <StatsCard title="Total de Animais" value={stats.totalAnimais} icon="🐄" />
          <StatsCard title="Total de Funcionários" value={stats.totalFuncionarios} icon="👥" />
          <StatsCard title="Total de Lotes" value={stats.totalLotes} icon="🐂" />
          <StatsCard title="Total de Vacinas" value={stats.totalVacinas} icon="💉" />
        </div>

        <div className="charts-vacinas-grid">
          <GenderChart machos={genderData.machos} femeas={genderData.femeas} />
          <VacinasCard vacinas={vacinasData} />
        </div>

        <div className="tables-column">
          <AnimaisTable animais={animaisData} />
          <PesagensTable pesagens={pesagensData} />
        </div>
      </div>
    </>
  );
};

export default DashboardHome;