import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animaisAPI, lotesAPI, vacinasAPI, pesagensAPI, funcionariosAPI } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import GenderChart from '../components/dashboard/GenderChart';
import VacinasCard from '../components/dashboard/VacinasCard';
import AnimaisTable from '../components/dashboard/AnimaisTable';
import PesagensTable from '../components/dashboard/PesagensTable';
import icons from '../assets/icons/index-all';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Pegando os ícones do dash
  const dashIcons = icons.dash || {};
  const { animais: iconAnimais, funcionarios: iconFuncionarios, lotes: iconLotes, vacinas: iconVacinas } = dashIcons;

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(currentUser));
    carregarDados();
  }, [navigate]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const animaisList = await animaisAPI.getAll();
      setAnimais(animaisList);
      
      const lotesList = await lotesAPI.getAll();
      
      const vacinasList = await vacinasAPI.getAll();
      setVacinasData(vacinasList.slice(0, 2).map(v => ({
        nome: v.nome,
        data: v.data_aplicacao ? new Date(v.data_aplicacao).toLocaleDateString('pt-BR') : '-',
        percentual: 100
      })));
      
      const pesagensList = await pesagensAPI.getAll();
      setPesagens(pesagensList);
      
      const funcionariosList = await funcionariosAPI.getAll();
      
      const totalMachos = animaisList.filter(a => a.sexo === 'Macho').length;
      const totalFemeas = animaisList.filter(a => a.sexo === 'Fêmea').length;
      const animaisAtivos = animaisList.filter(a => a.status === 'Ativo').length;
      
      setStats({
        totalAnimais: animaisList.length,
        animaisAtivos: animaisAtivos,
        totalLotes: lotesList.length,
        totalVacinas: vacinasList.length,
        totalPesagens: pesagensList.length,
        totalMachos: totalMachos,
        totalFemeas: totalFemeas,
        totalFuncionarios: funcionariosList.length
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
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
    .sort((a, b) => new Date(b.data_pesagem) - new Date(a.data_pesagem))
    .slice(0, 4)
    .map(pesagem => ({
      animal: pesagem.animal_nome || '-',
      data: pesagem.data_pesagem ? new Date(pesagem.data_pesagem).toLocaleDateString('pt-BR') : '-',
      peso: pesagem.peso ? `${pesagem.peso} kg` : '-'
    }));

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Olá {user?.nome || 'Usuário'}!</h2>
          <p>Veja os detalhes de toda a sua fazenda aqui</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando dados...</div>
        </div>
      </>
    );
  }

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
          <StatsCard title="Total de Animais" value={stats.totalAnimais} iconImg={iconAnimais} />
          <StatsCard title="Total de Funcionários" value={stats.totalFuncionarios} iconImg={iconFuncionarios} />
          <StatsCard title="Total de Lotes" value={stats.totalLotes} iconImg={iconLotes} />
          <StatsCard title="Total de Vacinas" value={stats.totalVacinas} iconImg={iconVacinas} />
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