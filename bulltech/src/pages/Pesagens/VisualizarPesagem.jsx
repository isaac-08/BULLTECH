import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatarGanhoDiario } from '../../utils/calculosPesagem';

const VisualizarPesagem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pesagem, setPesagem] = useState(null);
  const [ultimaPesagem, setUltimaPesagem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pesagens = JSON.parse(localStorage.getItem('pesagens') || '[]');
    const found = pesagens.find(p => p.id === parseInt(id));
    if (found) {
      setPesagem(found);
      
      // Buscar última pesagem anterior do mesmo animal
      const pesagensAnteriores = pesagens
        .filter(p => p.animalId === found.animalId && p.id !== found.id)
        .sort((a, b) => new Date(b.dataPesagem) - new Date(a.dataPesagem));
      
      if (pesagensAnteriores.length > 0) {
        setUltimaPesagem(pesagensAnteriores[0]);
      }
    } else {
      navigate('/pesagens');
    }
    setLoading(false);
  }, [id, navigate]);

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
              <label>ID do Animal</label>
              <p className="view-value">{pesagem.animalId}</p>
            </div>
            
            <div className="form-group">
              <label>Brinco</label>
              <p className="view-value">{pesagem.animalBrinco || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Animal</label>
              <p className="view-value">{pesagem.animalNome}</p>
            </div>
            
            <div className="form-group">
              <label>Data da Pesagem</label>
              <p className="view-value">{pesagem.dataPesagem}</p>
            </div>
            
            <div className="form-group">
              <label>Peso (Kg)</label>
              <p className="view-value">{pesagem.peso}</p>
            </div>
            
            <div className="form-group">
              <label>Ganho Diário (g/dia)</label>
              <p className="view-value">{formatarGanhoDiario(pesagem.ganhoDiario)}</p>
            </div>
            
            <div className="form-group">
              <label>Tipo</label>
              <p className="view-value">{pesagem.tipo || 'Rotina'}</p>
            </div>
            
            {ultimaPesagem && (
              <div className="form-group full-width">
                <label>Última Pesagem Anterior:</label>
                <div style={{ background: '#f0f2f5', padding: '10px', borderRadius: '6px', marginTop: '5px' }}>
                  <p><strong>Data:</strong> {ultimaPesagem.dataPesagem}</p>
                  <p><strong>Peso:</strong> {ultimaPesagem.peso} kg</p>
                  <p><strong>Diferença:</strong> {(pesagem.peso - ultimaPesagem.peso).toFixed(2)} kg</p>
                  <p><strong>Dias entre pesagens:</strong> {
                    (() => {
                      const dataAtual = new Date(pesagem.dataPesagem.split('/').reverse().join('-'));
                      const dataAnterior = new Date(ultimaPesagem.dataPesagem.split('/').reverse().join('-'));
                      const diffDias = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));
                      return `${diffDias} dias`;
                    })()
                  }</p>
                </div>
              </div>
            )}
            
            <div className="form-group full-width">
              <label>Observações</label>
              <p className="view-value">{pesagem.observacoes || 'Nenhuma observação'}</p>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn-edit" onClick={() => navigate(`/pesagens/editar/${pesagem.id}`)}>
              Editar Pesagem
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarPesagem;