import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pesagensAPI } from '../services/api';
import { podeAdicionar, getPlanoAtual } from '../utils/limites';
import iconsAcoes from '../assets/icons/acoes';
import iconsDash from '../assets/icons/dash';
import iconsRelat from '../assets/icons/relat';

const Pesagens = () => {
  const navigate = useNavigate();

  const [pesagens, setPesagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [plano, setPlano] = useState(null);
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  const { editar, visu, excluir } = iconsAcoes;
  const { animais: iconAnimais } = iconsDash;
  const { pesagem: iconPesagem, data: iconData } = iconsRelat;

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    setPlano(planoAtual);
    carregarPesagens(planoAtual);
  }, []);

  const carregarPesagens = async (planoAtual = plano) => {
    try {
      setLoading(true);
      const data = await pesagensAPI.getAll();
      setPesagens(data);
      if (planoAtual) {
        setAtingiuLimite(data.length >= planoAtual.limites.pesagens);
      }
    } catch (error) {
      console.error('Erro ao carregar pesagens:', error);
      alert('Erro ao carregar pesagens');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta pesagem?')) {
      try {
        await pesagensAPI.delete(id);
        await carregarPesagens();
        alert('Pesagem excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir pesagem:', error);
        alert('Erro ao excluir pesagem');
      }
    }
  };

  const handleNovaPesagem = () => {
    const verificacao = podeAdicionar('pesagens', pesagens.length);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/pesagens/novo');
  };

  const filteredPesagens = pesagens.filter(
    (p) =>
      p.animal_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.animal_brinco?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPesagens = pesagens.length;
  const totalAnimaisPesados = new Set(pesagens.map((p) => p.animal_id)).size;
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
        <h2>
          <img src={iconPesagem} alt="Pesagens" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Pesagens
        </h2>
        <p>Gerencie o histórico de pesagens dos animais</p>
      </div>

      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>
                  Seu {plano?.nome} permite no máximo {plano?.limites.pesagens} pesagens.
                  <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">
                    Clique aqui
                  </button> para fazer upgrade.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>
              <img src={iconData} alt="Total" className="icon icon-xs" style={{ marginRight: '5px' }} />
              Total de Pesagens
            </h3>
            <div className="stat-number">{totalPesagens}</div>
            <div className="stat-detail">Limite: {plano?.limites.pesagens}</div>
          </div>
          <div className="stat-card-animais">
            <h3>
              <img src={iconAnimais} alt="Animais" className="icon icon-xs" style={{ marginRight: '5px' }} />
              Animais Pesados
            </h3>
            <div className="stat-number">{totalAnimaisPesados}</div>
          </div>
          <div className="stat-card-animais">
            <h3>
              <img src={iconPesagem} alt="Peso" className="icon icon-xs" style={{ marginRight: '5px' }} />
              Peso Médio
            </h3>
            <div className="stat-number">{pesoMedio} kg</div>
          </div>
        </div>

        <button
          className="btn-novo"
          onClick={handleNovaPesagem}
          disabled={atingiuLimite}
          style={{
            opacity: atingiuLimite ? 0.5 : 1,
            cursor: atingiuLimite ? 'not-allowed' : 'pointer'
          }}
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
                <th>Brinco</th>
                <th>Animal</th>
                <th>Data</th>
                <th>Peso (Kg)</th>
                <th>Ganho Diário</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPesagens.map((pesagem) => (
                <tr key={pesagem.id}>
                  <td>{pesagem.animal_brinco || '-'}</td>
                  <td>{pesagem.animal_nome}</td>
                  <td>{new Date(pesagem.data_pesagem).toLocaleDateString('pt-BR')}</td>
                  <td>{pesagem.peso} kg</td>
                  <td className={pesagem.ganho_diario < 0 ? 'negative-gain' : ''}>
                    {pesagem.ganho_diario ? `${pesagem.ganho_diario} g/dia` : '-'}
                  </td>
                  <td>{pesagem.tipo || 'Rotina'}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/pesagens/editar/${pesagem.id}`)}>
                      <img src={editar} alt="Editar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn view" onClick={() => navigate(`/pesagens/visualizar/${pesagem.id}`)}>
                      <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(pesagem.id)}>
                      <img src={excluir} alt="Excluir" className="icon icon-sm icon-hover" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPesagens.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-message">
                    <img src={iconPesagem} alt="Pesagem" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <br />Nenhuma pesagem encontrada
                  </td>
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