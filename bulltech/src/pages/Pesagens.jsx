import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { podeAdicionar, getPlanoAtual, getUsoAtual } from '../utils/limites';


const Pesagens = () => {
  const navigate = useNavigate();
  const [pesagens, setPesagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [plano, setPlano] = useState(null);
  const [uso, setUso] = useState({});
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    const usoAtual = getUsoAtual();
    setPlano(planoAtual);
    setUso(usoAtual);
    setAtingiuLimite(usoAtual.pesagens >= planoAtual.limites.pesagens);
    carregarPesagens();
  }, []);

  const carregarPesagens = () => {
    const storedPesagens = localStorage.getItem('pesagens');
    if (storedPesagens) {
      setPesagens(JSON.parse(storedPesagens));
    } else {
      const initialPesagens = [];
      setPesagens(initialPesagens);
      localStorage.setItem('pesagens', JSON.stringify(initialPesagens));
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta pesagem?')) {
      const newPesagens = pesagens.filter(p => p.id !== id);
      setPesagens(newPesagens);
      localStorage.setItem('pesagens', JSON.stringify(newPesagens));
      alert('Pesagem excluída com sucesso!');
    }
  };

  const handleNovaPesagem = () => {
    const verificacao = podeAdicionar('pesagens', uso.pesagens);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/pesagens/novo');
  };

  const filteredPesagens = pesagens.filter(p => 
    p.animalNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.animalBrinco?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPesagens = pesagens.length;
  const totalAnimaisPesados = new Set(pesagens.map(p => p.animalId)).size;
  const pesoMedio = pesagens.length > 0 
    ? (pesagens.reduce((acc, p) => acc + p.peso, 0) / pesagens.length).toFixed(2) 
    : 0;

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Pesagens</h2>
          <p>Gerencie o histórico de pesagens dos animais</p>
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
        <h2>Pesagens</h2>
        <p>Gerencie o histórico de pesagens dos animais</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.pesagens} pesagens. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Pesagens</h3>
            <div className="stat-number">{totalPesagens}</div>
            <div className="stat-detail">Limite: {plano?.limites.pesagens}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Animais Pesados</h3>
            <div className="stat-number">{totalAnimaisPesados}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Peso Médio</h3>
            <div className="stat-number">{pesoMedio} kg</div>
          </div>
        </div>

        <button 
          className="btn-novo" 
          onClick={handleNovaPesagem}
          disabled={atingiuLimite}
          style={{ opacity: atingiuLimite ? 0.5 : 1, cursor: atingiuLimite ? 'not-allowed' : 'pointer' }}
        >
          + Nova Pesagem
        </button>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input 
                type="text" 
                placeholder="Buscar por nome ou brinco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>ID Animal</th>
                <th>Brinco</th>
                <th>Animal</th>
                <th>Data</th>
                <th>Peso (Kg)</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPesagens.map((pesagem) => (
                <tr key={pesagem.id}>
                  <td>{pesagem.animalId}</td>
                  <td>{pesagem.animalBrinco || '-'}</td>
                  <td>{pesagem.animalNome}</td>
                  <td>{pesagem.dataPesagem}</td>
                  <td>{pesagem.peso} kg</td>
                  <td>{pesagem.tipo || 'Rotina'}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/pesagens/editar/${pesagem.id}`)}>✏️</button>
                    <button className="action-btn view" onClick={() => navigate(`/pesagens/visualizar/${pesagem.id}`)}>👁️</button>
                    <button className="action-btn delete" onClick={() => handleDelete(pesagem.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {filteredPesagens.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-message">Nenhuma pesagem encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Pesagens;