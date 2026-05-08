import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VisualizarReproducao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reproducoes = JSON.parse(localStorage.getItem('reproducoes') || '[]');
    const found = reproducoes.find(r => r.id === parseInt(id));
    if (found) {
      setRegistro(found);
    } else {
      navigate('/reproducao');
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Visualizar Registro</h2>
          <p>Veja os detalhes do registro reprodutivo</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!registro) {
    return null;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Visualizar Registro</h2>
        <p>Veja os detalhes do registro reprodutivo</p>
      </div>
      
      <div className="page-content">
        <div className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>ID do Animal</label>
              <p className="view-value">{registro.animalId}</p>
            </div>
            
            <div className="form-group">
              <label>Brinco</label>
              <p className="view-value">{registro.animalBrinco || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Animal</label>
              <p className="view-value">{registro.animalNome}</p>
            </div>
            
            <div className="form-group">
              <label>Tipo de Evento</label>
              <p className="view-value">{registro.tipo}</p>
            </div>
            
            <div className="form-group">
              <label>Data do Evento</label>
              <p className="view-value">{registro.dataEvento}</p>
            </div>
            
            <div className="form-group">
              <label>Resultado</label>
              <p className="view-value">
                <span className={`status-badge ${registro.resultado === 'Prenha' || registro.resultado === 'Sucesso' ? 'applied' : 'pending'}`}>
                  {registro.resultado || '-'}
                </span>
              </p>
            </div>
            
            <div className="form-group">
              <label>Crias Nascidas</label>
              <p className="view-value">{registro.criasNascidas || 0}</p>
            </div>
            
            <div className="form-group">
              <label>Crias Vivas</label>
              <p className="view-value">{registro.criasVivas || 0}</p>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <p className="view-value">{registro.observacoes || 'Nenhuma observação'}</p>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn-edit" onClick={() => navigate(`/reproducao/editar/${registro.id}`)}>
              Editar Registro
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarReproducao;