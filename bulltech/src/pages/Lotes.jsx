import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { podeAdicionar, getPlanoAtual, getUsoAtual } from '../utils/limites';
import { syncLotesStats } from '../utils/syncData';


const Lotes = () => {
  const navigate = useNavigate();
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [plano, setPlano] = useState(null);
  const [uso, setUso] = useState({});
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    const usoAtual = getUsoAtual();
    setPlano(planoAtual);
    setUso(usoAtual);
    setAtingiuLimite(usoAtual.lotes >= planoAtual.limites.lotes);
    carregarLotes();
  }, []);

  const carregarLotes = () => {
    const lotesAtualizados = syncLotesStats();
    setLotes(lotesAtualizados);
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este lote?')) {
      const newLotes = lotes.filter(lote => lote.id !== id);
      localStorage.setItem('lotes', JSON.stringify(newLotes));
      carregarLotes();
      alert('Lote excluído com sucesso!');
    }
  };

  const handleNovoLote = () => {
    const verificacao = podeAdicionar('lotes', uso.lotes);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/lotes/novo');
  };

  const filteredLotes = lotes.filter(lote => {
    const matchesSearch = lote.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lote.id?.toString().includes(searchTerm);
    const matchesTipo = tipoFilter === 'todos' || lote.tipo?.toLowerCase() === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  const totalLotes = lotes.length;
  const totalAnimais = lotes.reduce((acc, lote) => acc + (lote.total_animais || 0), 0);
  const pesoMedio = lotes.length > 0 
    ? Math.round(lotes.reduce((acc, lote) => acc + (lote.peso_medio || 0), 0) / lotes.length) 
    : 0;

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Lotes</h2>
          <p>Gerencie os Lotes de sua propriedade</p>
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
        <h2>Lotes</h2>
        <p>Gerencie os Lotes de sua propriedade</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.lotes} lotes. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Lotes</h3>
            <div className="stat-number">{totalLotes}</div>
            <div className="stat-detail">Limite: {plano?.limites.lotes}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Total de Animais</h3>
            <div className="stat-number">{totalAnimais}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Peso Médio</h3>
            <div className="stat-number">{pesoMedio} kg</div>
          </div>
        </div>

        <button 
          className="btn-novo" 
          onClick={handleNovoLote}
          disabled={atingiuLimite}
          style={{ opacity: atingiuLimite ? 0.5 : 1, cursor: atingiuLimite ? 'not-allowed' : 'pointer' }}
        >
          + Novo Lote
        </button>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input 
                type="text" 
                placeholder="Buscar por código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Tipo:</label>
              <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="pasto">Pasto</option>
                <option value="confinamento">Confinamento</option>
                <option value="quarentena">Quarentena</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Área (m²)</th>
                <th>Animais</th>
                <th>Tipo</th>
                <th>Peso Médio (Kg)</th>
                <th>Machos</th>
                <th>Fêmeas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLotes.map((lote) => (
                <tr key={lote.id}>
                  <td>{lote.codigo || lote.id}</td>
                  <td>{lote.area || '-'}</td>
                  <td>{lote.total_animais || 0}</td>
                  <td>{lote.tipo || 'Pasto'}</td>
                  <td>{lote.peso_medio || '-'}</td>
                  <td>{lote.total_machos || 0}</td>
                  <td>{lote.total_femeas || 0}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/lotes/editar/${lote.id}`)}>✏️</button>
                    <button className="action-btn view" onClick={() => navigate(`/lotes/visualizar/${lote.id}`)}>👁️</button>
                    <button className="action-btn delete" onClick={() => handleDelete(lote.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {filteredLotes.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-message">Nenhum lote encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Lotes;