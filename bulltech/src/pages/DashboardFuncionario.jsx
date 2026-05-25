import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { animaisAPI, lotesAPI, pesagensAPI } from '../services/api';

const DashboardFuncionario = () => {
  const navigate = useNavigate();
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnimais: 0,
    totalLotes: 0,
    totalPesagens: 0
  });

  useEffect(() => {
    const funcionarioLogado = localStorage.getItem('funcionarioLogado');
    if (!funcionarioLogado) {
      navigate('/login-funcionario');
      return;
    }
    
    const func = JSON.parse(funcionarioLogado);
    setFuncionario(func);
    carregarDados();
  }, [navigate]);

  const carregarDados = async () => {
    try {
      const [animais, lotes, pesagens] = await Promise.all([
        animaisAPI.getAll(),
        lotesAPI.getAll(),
        pesagensAPI.getAll()
      ]);
      
      setStats({
        totalAnimais: animais.length,
        totalLotes: lotes.length,
        totalPesagens: pesagens.length
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('funcionarioLogado');
    navigate('/login-funcionario');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="loading">Carregando...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, width: '100%' }}>
        <div className="welcome-section" style={{ background: '#2c3e50', color: 'white', padding: '40px 20px' }}>
          <h2>Olá, {funcionario?.nome}!</h2>
          <p>Bem-vindo ao dashboard de funcionário - Cargo: {funcionario?.cargo}</p>
          <button 
            onClick={handleLogout}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Sair
          </button>
        </div>
        
        <div className="page-content">
          <div className="stats-cards-animais">
            <div className="stat-card-animais">
              <h3>🐄 Total de Animais</h3>
              <div className="stat-number">{stats.totalAnimais}</div>
            </div>
            <div className="stat-card-animais">
              <h3>📦 Total de Lotes</h3>
              <div className="stat-number">{stats.totalLotes}</div>
            </div>
            <div className="stat-card-animais">
              <h3>⚖️ Total de Pesagens</h3>
              <div className="stat-number">{stats.totalPesagens}</div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardFuncionario;