import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import iconsAcoes from '../../assets/icons/acoes';
import dietaIcon from '../../assets/icons/dietas.png';
import alimentoIcon from '../../assets/icons/alimento.png';
import animaisIcon from '../../assets/icons/animais.png';
import './Dietas.css';

const VisualizarDieta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dieta, setDieta] = useState(null);
  const [alimentos, setAlimentos] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);

  const { editar, visu, excluir } = iconsAcoes;

  useEffect(() => {
    carregarDieta();
  }, [id]);

  const carregarDieta = async () => {
    try {
      setLoading(true);
      
      const { data: dietaData, error: dietaError } = await supabase
        .from('dietas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (dietaError) throw dietaError;
      setDieta(dietaData);
      
      const { data: alimentosData, error: alimentosError } = await supabase
        .from('dieta_alimentos')
        .select('*, estoque(*)')
        .eq('dieta_id', id);
      
      if (alimentosError) throw alimentosError;
      setAlimentos(alimentosData || []);
      
      const { data: animaisData, error: animaisError } = await supabase
        .from('dieta_animais')
        .select('*, animais(*)')
        .eq('dieta_id', id);
      
      if (animaisError) throw animaisError;
      setAnimais(animaisData || []);
      
    } catch (error) {
      console.error('Erro ao carregar dieta:', error);
      navigate('/dietas');
    } finally {
      setLoading(false);
    }
  };

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
        <h2>
          <img src={dietaIcon} alt="Dieta" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {dieta.nome}
        </h2>
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
              <p className="view-value">{dieta.tipo || '-'}</p>
            </div>
            <div className="form-group">
              <label>Frequência</label>
              <p className="view-value">{dieta.frequencia || '-'}</p>
            </div>
            <div className="form-group full-width">
              <label>Observações</label>
              <p className="view-value">{dieta.observacoes || 'Nenhuma observação'}</p>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={alimentoIcon} alt="Alimentos" className="icon icon-sm" />
          Alimentos
        </h3>
        {alimentos.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr><th>Alimento</th><th>Quantidade</th><th>Unidade</th></tr>
            </thead>
            <tbody>
              {alimentos.map((item, index) => (
                <tr key={index}>
                  <td>{item.estoque?.nome || '-'}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.unidade || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-message">Nenhum alimento cadastrado nesta dieta</div>
        )}

        <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={animaisIcon} alt="Animais" className="icon icon-sm" />
          Animais
        </h3>
        {animais.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr><th>Brinco</th><th>Nome</th><th>Data Início</th><th>Status</th></tr>
            </thead>
            <tbody>
              {animais.map((item, index) => (
                <tr key={index}>
                  <td>{item.animais?.brinco || '-'}</td>
                  <td>{item.animais?.nome || '-'}</td>
                  <td>{new Date(item.data_inicio).toLocaleDateString('pt-BR')}</td>
                  <td className="actions-cell">
                    <span className={`status-badge ${item.status === 'Ativa' ? 'applied' : 'pending'}`}>
                      {item.status}
                    </span>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-message">Nenhum animal associado a esta dieta</div>
        )}
        
        <div className="form-actions" style={{ marginTop: '20px' }}>
          <button className="btn-edit" onClick={() => navigate(`/dietas/editar/${dieta.id}`)}>
            <img src={editar} alt="Editar" className="icon icon-sm icon-hover" style={{ marginRight: '5px' }} />
            Editar Dieta
          </button>
          <button className="btn-cancel" onClick={() => navigate('/dietas')}>
            Voltar
          </button>
        </div>
      </div>
    </>
  );
};

export default VisualizarDieta;