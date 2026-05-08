import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { podeAdicionar, getPlanoAtual, getUsoAtual } from '../utils/limites';


const Dietas = () => {
  const navigate = useNavigate();
  const [dietas, setDietas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [plano, setPlano] = useState(null);
  const [uso, setUso] = useState({});
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    const usoAtual = getUsoAtual();
    setPlano(planoAtual);
    setUso(usoAtual);
    setAtingiuLimite(usoAtual.dietas >= planoAtual.limites.dietas);
    carregarDietas();
  }, []);

  const carregarDietas = () => {
    const storedDietas = localStorage.getItem('dietas');
    if (storedDietas) {
      setDietas(JSON.parse(storedDietas));
    } else {
      const initialDietas = [
        { id: 1, nome: 'Ração de Crescimento', tipo: 'Concentrado', quantidade: 5, unidade: 'kg', frequencia: '2x ao dia', animais: 'Bovinos' }
      ];
      setDietas(initialDietas);
      localStorage.setItem('dietas', JSON.stringify(initialDietas));
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta dieta?')) {
      const newDietas = dietas.filter(d => d.id !== id);
      setDietas(newDietas);
      localStorage.setItem('dietas', JSON.stringify(newDietas));
      alert('Dieta excluída com sucesso!');
    }
  };

  const handleNovaDieta = () => {
    const verificacao = podeAdicionar('dietas', uso.dietas);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/dietas/novo');
  };

  const filteredDietas = dietas.filter(dieta => {
    const matchesSearch = dieta.nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'Todos' || dieta.tipo === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  const totalDietas = dietas.length;
  const tipos = ['Todos', ...new Set(dietas.map(d => d.tipo))];

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Dietas</h2>
          <p>Gerencie as dietas dos animais</p>
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
        <h2>Dietas</h2>
        <p>Gerencie as dietas dos animais</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.dietas} dietas. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Dietas</h3>
            <div className="stat-number">{totalDietas}</div>
            <div className="stat-detail">Limite: {plano?.limites.dietas}</div>
          </div>
        </div>

        <button 
          className="btn-novo" 
          onClick={handleNovaDieta}
          disabled={atingiuLimite}
          style={{ opacity: atingiuLimite ? 0.5 : 1, cursor: atingiuLimite ? 'not-allowed' : 'pointer' }}
        >
          + Nova Dieta
        </button>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input 
                type="text" 
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Tipo:</label>
              <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Unidade</th>
                <th>Frequência</th>
                <th>Animais</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDietas.map((dieta) => (
                <tr key={dieta.id}>
                  <td>{dieta.nome}</td>
                  <td>{dieta.tipo}</td>
                  <td>{dieta.quantidade} {dieta.unidade}</td>
                  <td>{dieta.unidade}</td>
                  <td>{dieta.frequencia}</td>
                  <td>{dieta.animais || '-'}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/dietas/editar/${dieta.id}`)}>✏️</button>
                    <button className="action-btn view" onClick={() => navigate(`/dietas/visualizar/${dieta.id}`)}>👁️</button>
                    <button className="action-btn delete" onClick={() => handleDelete(dieta.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {filteredDietas.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-message">Nenhuma dieta encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dietas;