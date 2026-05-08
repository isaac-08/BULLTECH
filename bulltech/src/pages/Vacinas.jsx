import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { podeAdicionar, getPlanoAtual, getUsoAtual } from '../utils/limites';


const Vacinas = () => {
  const navigate = useNavigate();
  const [vacinasAplicadas, setVacinasAplicadas] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [plano, setPlano] = useState(null);
  const [uso, setUso] = useState({});
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    const usoAtual = getUsoAtual();
    setPlano(planoAtual);
    setUso(usoAtual);
    setAtingiuLimite(usoAtual.vacinas >= planoAtual.limites.vacinas);
    carregarVacinas();
  }, []);

  const carregarVacinas = () => {
    // Carregar VACINAS APLICADAS (não do estoque)
    const storedVacinasAplicadas = localStorage.getItem('vacinasAplicadas') || '[]';
    const vacinas = JSON.parse(storedVacinasAplicadas);
    setVacinasAplicadas(vacinas);
    
    // Carregar animais para referência
    const storedAnimais = localStorage.getItem('animais') || '[]';
    setAnimais(JSON.parse(storedAnimais));
    
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de vacina?')) {
      const newVacinas = vacinasAplicadas.filter(v => v.id !== id);
      setVacinasAplicadas(newVacinas);
      localStorage.setItem('vacinasAplicadas', JSON.stringify(newVacinas));
      alert('Registro de vacina excluído com sucesso!');
    }
  };

  const handleNovaVacina = () => {
    const verificacao = podeAdicionar('vacinas', uso.vacinas);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/vacinas/aplicar');
  };

  const filteredVacinas = vacinasAplicadas.filter(v => {
    const matchesSearch = v.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.animalNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.animalBrinco?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVacinas = vacinasAplicadas.length;
  const totalAplicadas = vacinasAplicadas.filter(v => v.status === 'Aplicada').length;
  const totalPendentes = vacinasAplicadas.filter(v => v.status === 'Pendente').length;
  const totalAnimaisVacinados = new Set(vacinasAplicadas.map(v => v.animalId)).size;

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Vacinas Aplicadas</h2>
          <p>Histórico de vacinas aplicadas nos animais</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Vacinas Aplicadas</h2>
        <p>Histórico de vacinas aplicadas nos animais</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.vacinas} registros de vacinas. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Cards de estatísticas */}
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Vacinas</h3>
            <div className="stat-number">{totalVacinas}</div>
            <div className="stat-detail">Registros no total</div>
          </div>
          <div className="stat-card-animais">
            <h3>Doses Aplicadas</h3>
            <div className="stat-number" style={{ color: '#27ae60' }}>{totalAplicadas}</div>
            <div className="stat-detail">Vacinas já aplicadas</div>
          </div>
          <div className="stat-card-animais">
            <h3>Doses Pendentes</h3>
            <div className="stat-number" style={{ color: '#e74c3c' }}>{totalPendentes}</div>
            <div className="stat-detail">Vacinas agendadas</div>
          </div>
          <div className="stat-card-animais">
            <h3>Animais Vacinados</h3>
            <div className="stat-number">{totalAnimaisVacinados}</div>
            <div className="stat-detail">Animais com registro</div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="actions-bar" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button className="btn-novo" onClick={handleNovaVacina} disabled={atingiuLimite}>
            + Registrar Aplicação
          </button>
        </div>

        {/* Filtros */}
        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input 
                type="text" 
                placeholder="Buscar por vacina, animal ou brinco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>Todos</option>
                <option>Aplicada</option>
                <option>Pendente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela de vacinas aplicadas */}
        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Vacina</th>
                <th>Animal</th>
                <th>Brinco</th>
                <th>Dose</th>
                <th>Aplicador</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVacinas.map((vacina) => (
                <tr key={vacina.id}>
                  <td>{vacina.dataAplicacao || '-'}</td>
                  <td>{vacina.nome}</td>
                  <td>{vacina.animalNome || '-'}</td>
                  <td>{vacina.animalBrinco || '-'}</td>
                  <td>{vacina.dose || '-'}</td>
                  <td>{vacina.aplicador || '-'}</td>
                  <td className="actions-cell"></td>
                    <span className={`status-badge ${vacina.status === 'Aplicada' ? 'applied' : 'pending'}`}>
                      {vacina.status || 'Pendente'}
                    </span>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/vacinas/editar/${vacina.id}`)}>✏️</button>
                    <button className="action-btn view" onClick={() => navigate(`/vacinas/visualizar/${vacina.id}`)}>👁️</button>
                    <button className="action-btn delete" onClick={() => handleDelete(vacina.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {filteredVacinas.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-message">Nenhuma vacina aplicada encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Vacinas;