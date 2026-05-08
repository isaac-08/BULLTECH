import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dados, setDados] = useState({
    animais: [],
    lotes: [],
    vacinas: [],
    pesagens: [],
    estoque: [],
    funcionarios: [],
    reproducoes: [],
    dietas: []
  });

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(currentUser);
    
    // Verificar se é admin (por email ou flag)
    if (userData.email !== 'admin@bulltech.com' && !userData.isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    setUser(userData);
    carregarDados();
  }, [navigate]);

  const carregarDados = () => {
    setDados({
      animais: JSON.parse(localStorage.getItem('animais') || '[]'),
      lotes: JSON.parse(localStorage.getItem('lotes') || '[]'),
      vacinas: JSON.parse(localStorage.getItem('vacinas') || '[]'),
      pesagens: JSON.parse(localStorage.getItem('pesagens') || '[]'),
      estoque: JSON.parse(localStorage.getItem('estoque') || '[]'),
      funcionarios: JSON.parse(localStorage.getItem('funcionarios') || '[]'),
      reproducoes: JSON.parse(localStorage.getItem('reproducao') || '[]'),
      dietas: JSON.parse(localStorage.getItem('dietas') || '[]')
    });
  };

  const estatisticas = {
    totalAnimais: dados.animais.length,
    totalLotes: dados.lotes.length,
    totalVacinas: dados.vacinas.length,
    totalPesagens: dados.pesagens.length,
    totalEstoque: dados.estoque.length,
    totalFuncionarios: dados.funcionarios.length,
    totalReproducoes: dados.reproducoes.length,
    totalDietas: dados.dietas.length,
    totalMachos: dados.animais.filter(a => a.sexo === 'Macho').length,
    totalFemeas: dados.animais.filter(a => a.sexo === 'Fêmea').length
  };

  if (!user) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Painel do Administrador</h2>
        <p>Visão geral completa do sistema</p>
      </div>
      
      <div className="page-content">
        <div className="admin-stats-grid">
          <div className="stat-card-animais">
            <h3>🐄 Animais</h3>
            <div className="stat-number">{estatisticas.totalAnimais}</div>
            <div className="stat-detail">{estatisticas.totalMachos} M | {estatisticas.totalFemeas} F</div>
          </div>
          <div className="stat-card-animais">
            <h3>📦 Lotes</h3>
            <div className="stat-number">{estatisticas.totalLotes}</div>
          </div>
          <div className="stat-card-animais">
            <h3>💉 Vacinas</h3>
            <div className="stat-number">{estatisticas.totalVacinas}</div>
          </div>
          <div className="stat-card-animais">
            <h3>⚖️ Pesagens</h3>
            <div className="stat-number">{estatisticas.totalPesagens}</div>
          </div>
          <div className="stat-card-animais">
            <h3>📦 Estoque</h3>
            <div className="stat-number">{estatisticas.totalEstoque}</div>
          </div>
          <div className="stat-card-animais">
            <h3>👥 Funcionários</h3>
            <div className="stat-number">{estatisticas.totalFuncionarios}</div>
          </div>
          <div className="stat-card-animais">
            <h3>🤰 Reproduções</h3>
            <div className="stat-number">{estatisticas.totalReproducoes}</div>
          </div>
          <div className="stat-card-animais">
            <h3>🍽️ Dietas</h3>
            <div className="stat-number">{estatisticas.totalDietas}</div>
          </div>
        </div>

        <div className="admin-actions">
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            Ir para Dashboard
          </button>
          <button className="btn-primary" onClick={() => navigate('/configuracoes')}>
            Configurações
          </button>
          <button className="btn-primary" onClick={() => {
            if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita!')) {
              localStorage.clear();
              window.location.href = '/';
            }
          }}>
            Limpar Todos os Dados
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;