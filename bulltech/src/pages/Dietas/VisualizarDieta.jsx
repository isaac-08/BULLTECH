import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VisualizarDieta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dieta, setDieta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dietas = JSON.parse(localStorage.getItem('dietas') || '[]');
    const found = dietas.find(d => d.id === parseInt(id));
    if (found) {
      setDieta(found);
    } else {
      navigate('/dietas');
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Visualizar Dieta</h2>
          <p>Veja os detalhes da dieta</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!dieta) {
    return null;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Visualizar Dieta</h2>
        <p>Veja os detalhes da dieta</p>
      </div>
      
      <div className="page-content">
        <div className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome da Dieta</label>
              <p className="view-value">{dieta.nome}</p>
            </div>
            
            <div className="form-group">
              <label>Tipo</label>
              <p className="view-value">{dieta.tipo}</p>
            </div>
            
            <div className="form-group">
              <label>Quantidade</label>
              <p className="view-value">{dieta.quantidade} {dieta.unidade}</p>
            </div>
            
            <div className="form-group">
              <label>Frequência</label>
              <p className="view-value">{dieta.frequencia}</p>
            </div>
            
            <div className="form-group">
              <label>Animais</label>
              <p className="view-value">{dieta.animais || '-'}</p>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <p className="view-value">{dieta.observacoes || 'Nenhuma observação'}</p>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn-edit" onClick={() => navigate(`/dietas/editar/${dieta.id}`)}>
              Editar Dieta
            </button>
            <button className="btn-cancel" onClick={() => navigate('/dietas')}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarDieta;