import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pesagensAPI } from '../../services/api';

const VisualizarPesagem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pesagem, setPesagem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPesagem();
  }, [id]);

  const carregarPesagem = async () => {
    try {
      setLoading(true);
      const data = await pesagensAPI.getOne(id);
      setPesagem(data);
    } catch (error) {
      console.error('Erro ao carregar pesagem:', error);
      navigate('/pesagens');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Visualizar Pesagem</h2>
          <p>Veja os detalhes da pesagem</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!pesagem) {
    return null;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Visualizar Pesagem</h2>
        <p>Veja os detalhes da pesagem</p>
      </div>
      
      <div className="page-content">
        <div className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Brinco</label>
              <p className="view-value">{pesagem.animal_brinco || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Animal</label>
              <p className="view-value">{pesagem.animal_nome}</p>
            </div>
            
            <div className="form-group">
              <label>Data da Pesagem</label>
              <p className="view-value">{new Date(pesagem.data_pesagem).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="form-group">
              <label>Peso (Kg)</label>
              <p className="view-value">{pesagem.peso} kg</p>
            </div>
            
            <div className="form-group">
              <label>Ganho Diário</label>
              <p className="view-value">{pesagem.ganho_diario ? `${pesagem.ganho_diario} g/dia` : 'Não calculado'}</p>
            </div>
            
            <div className="form-group">
              <label>Tipo</label>
              <p className="view-value">{pesagem.tipo || 'Rotina'}</p>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <p className="view-value">{pesagem.observacoes || 'Nenhuma observação'}</p>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn-edit" onClick={() => navigate(`/pesagens/editar/${pesagem.id}`)}>
              Editar Pesagem
            </button>
            <button className="btn-cancel" onClick={() => navigate('/pesagens')}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarPesagem;