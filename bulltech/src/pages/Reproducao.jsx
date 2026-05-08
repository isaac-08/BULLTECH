import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { podeAdicionar, getPlanoAtual, getUsoAtual } from '../utils/limites';


const Reproducao = () => {
  const navigate = useNavigate();
  const [reproducoes, setReproducoes] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [resultadoFilter, setResultadoFilter] = useState('Todos');
  const [plano, setPlano] = useState(null);
  const [uso, setUso] = useState({});
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    const usoAtual = getUsoAtual();
    setPlano(planoAtual);
    setUso(usoAtual);
    setAtingiuLimite(usoAtual.reproducoes >= planoAtual.limites.reproducoes);
    carregarDados();
  }, []);

  const carregarDados = () => {
    const storedReproducoes = localStorage.getItem('reproducoes');
    const storedAnimais = localStorage.getItem('animais');
    
    if (storedReproducoes) {
      setReproducoes(JSON.parse(storedReproducoes));
    } else {
      const initialReproducoes = [];
      setReproducoes(initialReproducoes);
      localStorage.setItem('reproducoes', JSON.stringify(initialReproducoes));
    }
    
    if (storedAnimais) {
      setAnimais(JSON.parse(storedAnimais));
    }
    
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      const newReproducoes = reproducoes.filter(r => r.id !== id);
      setReproducoes(newReproducoes);
      localStorage.setItem('reproducoes', JSON.stringify(newReproducoes));
      alert('Registro excluído com sucesso!');
    }
  };

  const handleNovoRegistro = () => {
    const verificacao = podeAdicionar('reproducoes', uso.reproducoes);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/reproducao/novo');
  };

  const filteredReproducoes = reproducoes.filter(reg => {
    const matchesSearch = reg.animalNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          reg.animalBrinco?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'Todos' || reg.tipo === tipoFilter;
    const matchesResultado = resultadoFilter === 'Todos' || reg.resultado === resultadoFilter;
    return matchesSearch && matchesTipo && matchesResultado;
  });

  const totalEventos = reproducoes.length;

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Reprodução</h2>
          <p>Gerencie os eventos reprodutivos do seu rebanho</p>
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
        <h2>Reprodução</h2>
        <p>Gerencie os eventos reprodutivos do seu rebanho</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.reproducoes} registros de reprodução. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Eventos</h3>
            <div className="stat-number">{totalEventos}</div>
            <div className="stat-detail">Limite: {plano?.limites.reproducoes}</div>
          </div>
        </div>

        <button 
          className="btn-novo" 
          onClick={handleNovoRegistro}
          disabled={atingiuLimite}
          style={{ opacity: atingiuLimite ? 0.5 : 1, cursor: atingiuLimite ? 'not-allowed' : 'pointer' }}
        >
          + Novo Registro
        </button>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input 
                type="text" 
                placeholder="Buscar por animal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Tipo:</label>
              <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                <option>Todos</option>
                <option>Cobertura</option>
                <option>Inseminação</option>
                <option>Parto</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Resultado:</label>
              <select value={resultadoFilter} onChange={(e) => setResultadoFilter(e.target.value)}>
                <option>Todos</option>
                <option>Prenha</option>
                <option>Não Prenha</option>
                <option>Sucesso</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>Animal</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Resultado</th>
                <th>Crias</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReproducoes.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.animalNome}</td>
                  <td>{reg.tipo}</td>
                  <td>{reg.dataEvento}</td>
                  <td className="actions-cell">
                    <span className={`status-badge ${reg.resultado === 'Prenha' || reg.resultado === 'Sucesso' ? 'applied' : 'pending'}`}>
                      {reg.resultado}
                    </span>
                   </td>
                  <td>{reg.criasVivas > 0 ? `${reg.criasVivas} vivas` : '-'}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/reproducao/editar/${reg.id}`)}>✏️</button>
                    <button className="action-btn view" onClick={() => navigate(`/reproducao/visualizar/${reg.id}`)}>👁️</button>
                    <button className="action-btn delete" onClick={() => handleDelete(reg.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {filteredReproducoes.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-message">Nenhum registro encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Reproducao;