import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reproducoesAPI } from '../../services/api';

const VisualizarReproducao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarRegistro();
  }, [id]);

  const carregarRegistro = async () => {
    try {
      setLoading(true);
      const data = await reproducoesAPI.getOne(id);
      setRegistro(data);
    } catch (error) {
      console.error('Erro ao carregar registro:', error);
      navigate('/reproducao');
    } finally {
      setLoading(false);
    }
  };

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
              <p className="view-value">{registro.animal_id}</p>
            </div>
            
            <div className="form-group">
              <label>Brinco</label>
              <p className="view-value">{registro.animal_brinco || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Animal</label>
              <p className="view-value">{registro.animal_nome}</p>
            </div>
            
            <div className="form-group">
              <label>Tipo de Evento</label>
              <p className="view-value">{registro.tipo}</p>
            </div>
            
            <div className="form-group">
              <label>Data do Evento</label>
              <p className="view-value">{registro.data_evento ? new Date(registro.data_evento).toLocaleDateString('pt-BR') : '-'}</p>
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
              <p className="view-value">{registro.crias_nascidas || 0}</p>
            </div>
            
            <div className="form-group">
              <label>Crias Vivas</label>
              <p className="view-value">{registro.crias_vivas || 0}</p>
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
            <button className="btn-cancel" onClick={() => navigate('/reproducao')}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarReproducao;