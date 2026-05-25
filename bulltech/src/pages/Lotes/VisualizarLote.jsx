import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lotesAPI, animaisAPI } from '../../services/api';
import iconsAcoes from '../../assets/icons/acoes';
import iconsDash from '../../assets/icons/dash';

const VisualizarLote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lote, setLote] = useState(null);
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);

  const { editar, visu, excluir } = iconsAcoes;
  const { lotes: iconLotes, animais: iconAnimais } = iconsDash;

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const loteData = await lotesAPI.getOne(id);
      setLote(loteData);
      
      const todosAnimais = await animaisAPI.getAll();
      
      const animaisDoLote = todosAnimais.filter(animal => 
        animal.lote === loteData.codigo || 
        animal.lote === loteData.id?.toString()
      );
      
      setAnimais(animaisDoLote);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      navigate('/lotes');
    } finally {
      setLoading(false);
    }
  };

  const atualizarEstatisticasLote = async () => {
    try {
      const totalAnimais = animais.length;
      const totalMachos = animais.filter(a => a.sexo === 'Macho').length;
      const totalFemeas = animais.filter(a => a.sexo === 'Fêmea').length;
      const pesoMedio = totalAnimais > 0 
        ? (animais.reduce((acc, a) => acc + (parseFloat(a.peso) || 0), 0) / totalAnimais).toFixed(2)
        : 0;
      
      await lotesAPI.update(id, {
        ...lote,
        total_animais: totalAnimais,
        total_machos: totalMachos,
        total_femeas: totalFemeas,
        peso_medio: parseFloat(pesoMedio)
      });
      
      setLote({
        ...lote,
        total_animais: totalAnimais,
        total_machos: totalMachos,
        total_femeas: totalFemeas,
        peso_medio: parseFloat(pesoMedio)
      });
      
    } catch (error) {
      console.error('Erro ao atualizar estatísticas:', error);
    }
  };

  useEffect(() => {
    if (animais.length > 0 || lote) {
      atualizarEstatisticasLote();
    }
  }, [animais]);

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

  const totalAnimais = animais.length;
  const totalMachos = animais.filter(a => a.sexo === 'Macho').length;
  const totalFemeas = animais.filter(a => a.sexo === 'Fêmea').length;
  const pesoMedio = totalAnimais > 0 
    ? (animais.reduce((acc, a) => acc + (parseFloat(a.peso) || 0), 0) / totalAnimais).toFixed(2)
    : 0;

  return (
    <>
      <div className="welcome-section">
        <h2>
          <img src={iconLotes} alt="Lote" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {lote.codigo}
        </h2>
        <p>Veja os detalhes do lote e seus animais</p>
      </div>
      
      <div className="page-content">
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
              <label>Status</label>
              <p className="view-value">
                <span className={`status-badge ${lote.status === 'Ativo' ? 'applied' : 'pending'}`}>
                  {lote.status || 'Ativo'}
                </span>
              </p>
            </div>
            <div className="form-group">
              <label>Data de Criação</label>
              <p className="view-value">{lote.created_at ? new Date(lote.created_at).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Observações</label>
            <p className="view-value">{lote.observacoes || 'Nenhuma observação'}</p>
          </div>
        </div>

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

        <h3 style={{ margin: '20px 0 10px 0', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={iconAnimais} alt="Animais" className="icon icon-md" />
          Animais no Lote ({totalAnimais})
        </h3>
        
        {animais.length > 0 ? (
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
                    <td className="actions-cell">
                      <span className={`status-badge ${animal.status === 'Ativo' ? 'applied' : 'pending'}`}>
                        {animal.status || 'Ativo'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="action-btn view" 
                        onClick={() => navigate(`/animais/visualizar/${animal.id}`)}
                        title="Ver Animal"
                      >
                        <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                      </button>
                      <button 
                        className="action-btn edit" 
                        onClick={() => navigate(`/animais/editar/${animal.id}`)}
                        title="Editar Animal"
                      >
                        <img src={editar} alt="Editar" className="icon icon-sm icon-hover" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-message" style={{ textAlign: 'center', padding: '40px' }}>
            <img src={iconAnimais} alt="Animais" className="icon icon-lg" style={{ opacity: 0.5, marginBottom: '10px' }} />
            <br />
            <strong>Nenhum animal neste lote</strong>
            <br />
            <small>Para adicionar animais a este lote, edite o animal e selecione este lote.</small>
            <br /><br />
            <button
              onClick={() => navigate('/animais')}
              style={{
                padding: '10px 20px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Ver Animais
            </button>
          </div>
        )}
        
        <div className="form-actions" style={{ marginTop: '20px' }}>
          <button className="btn-edit" onClick={() => navigate(`/lotes/editar/${lote.id}`)}>
            <img src={editar} alt="Editar" className="icon icon-sm icon-hover" style={{ marginRight: '5px' }} />
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