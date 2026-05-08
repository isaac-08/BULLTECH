import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VisualizarLote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lote, setLote] = useState(null);
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lotes = JSON.parse(localStorage.getItem('lotes') || '[]');
    const found = lotes.find(l => l.id === parseInt(id));
    
    if (found) {
      setLote(found);
      
      // Buscar animais que pertencem a este lote
      const storedAnimais = JSON.parse(localStorage.getItem('animais') || '[]');
      const animaisDoLote = storedAnimais.filter(a => 
        a.lote === found.codigo || 
        a.lote === found.id?.toString() ||
        (found.codigo && a.lote === found.codigo)
      );
      setAnimais(animaisDoLote);
    } else {
      navigate('/lotes');
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Visualizar Lote</h2>
          <p>Veja os detalhes do lote e seus animais</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!lote) {
    return null;
  }

  // Estatísticas dos animais do lote
  const totalAnimais = animais.length;
  const totalMachos = animais.filter(a => a.sexo === 'Macho').length;
  const totalFemeas = animais.filter(a => a.sexo === 'Fêmea').length;
  const pesoMedio = totalAnimais > 0 
    ? (animais.reduce((acc, a) => acc + (parseFloat(a.peso) || 0), 0) / totalAnimais).toFixed(2)
    : 0;

  return (
    <>
      <div className="welcome-section">
        <h2>Visualizar Lote</h2>
        <p>Veja os detalhes do lote e seus animais</p>
      </div>
      
      <div className="page-content">
        {/* Informações do Lote */}
        <div className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Código do Lote</label>
              <p className="view-value">{lote.codigo}</p>
            </div>
            
            <div className="form-group">
              <label>Área (m²)</label>
              <p className="view-value">{lote.area || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Tipo</label>
              <p className="view-value">{lote.tipo || 'Pasto'}</p>
            </div>
            
            <div className="form-group">
              <label>Data de Criação</label>
              <p className="view-value">{lote.criado_em ? new Date(lote.criado_em).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Observações</label>
            <p className="view-value">{lote.observacoes || 'Nenhuma observação'}</p>
          </div>
        </div>

        {/* Cards de estatísticas do lote */}
        <div className="stats-cards-animais" style={{ marginTop: '20px' }}>
          <div className="stat-card-animais">
            <h3>Total de Animais</h3>
            <div className="stat-number">{totalAnimais}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Machos</h3>
            <div className="stat-number">{totalMachos}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Fêmeas</h3>
            <div className="stat-number">{totalFemeas}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Peso Médio</h3>
            <div className="stat-number">{pesoMedio} kg</div>
          </div>
        </div>

        {/* Lista de Animais do Lote */}
        <h3 style={{ margin: '20px 0 10px 0', color: '#2c3e50' }}>Animais no Lote</h3>
        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Brinco</th>
                <th>Nome</th>
                <th>Sexo</th>
                <th>Idade</th>
                <th>Peso (Kg)</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {animais.map((animal) => (
                <tr key={animal.id}>
                  <td>{animal.id}</td>
                  <td>{animal.brinco}</td>
                  <td>{animal.nome}</td>
                  <td>{animal.sexo}</td>
                  <td>{animal.idade || '-'}</td>
                  <td>{animal.peso ? `${animal.peso} kg` : '-'}</td>
                  <td>
                    <span className={`status-badge ${animal.status === 'Ativo' ? 'applied' : 'pending'}`}>
                      {animal.status}
                    </span>
                   </td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view" 
                      onClick={() => navigate(`/animais/visualizar/${animal.id}`)}
                      title="Ver Animal"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn edit" 
                      onClick={() => navigate(`/animais/editar/${animal.id}`)}
                      title="Editar Animal"
                    >
                      ✏️
                    </button>
                    </td>
                </tr>
              ))}
              {animais.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-message">Nenhum animal neste lote</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="form-actions" style={{ marginTop: '20px' }}>
          <button className="btn-edit" onClick={() => navigate(`/lotes/editar/${lote.id}`)}>
            Editar Lote
          </button>
          <button className="btn-cancel" onClick={() => navigate('/lotes')}>
            Voltar
          </button>
        </div>
      </div>
    </>
  );
};

export default VisualizarLote;