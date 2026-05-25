import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lotesAPI, animaisAPI } from '../services/api';
import { podeAdicionar, getPlanoAtual } from '../utils/limites';
import iconsAcoes from '../assets/icons/acoes';
import iconsDash from '../assets/icons/dash';

const Lotes = () => {
  const navigate = useNavigate();

  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [plano, setPlano] = useState(null);
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  const { editar, visu, excluir } = iconsAcoes;
  const { lotes: iconLotes } = iconsDash;

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    setPlano(planoAtual);
    carregarLotes(planoAtual);
  }, []);

  const carregarLotes = async (planoAtual = plano) => {
    try {
      setLoading(true);

      const lotesData = await lotesAPI.getAll();
      const todosAnimais = await animaisAPI.getAll();

      const lotesComContagem = await Promise.all(
        lotesData.map(async (lote) => {
          const animaisNoLote = todosAnimais.filter(
            (animal) =>
              animal.lote === lote.codigo ||
              animal.lote === lote.id?.toString()
          );

          const totalAnimais = animaisNoLote.length;
          const totalMachos = animaisNoLote.filter(
            (a) => a.sexo === 'Macho'
          ).length;
          const totalFemeas = animaisNoLote.filter(
            (a) => a.sexo === 'Fêmea'
          ).length;
          const pesoMedio =
            totalAnimais > 0
              ? animaisNoLote.reduce(
                  (acc, a) =>
                    acc + (parseFloat(a.peso) || 0),
                  0
                ) / totalAnimais
              : 0;

          if (lote.total_animais !== totalAnimais) {
            await lotesAPI.update(lote.id, {
              ...lote,
              total_animais: totalAnimais,
              total_machos: totalMachos,
              total_femeas: totalFemeas,
              peso_medio: pesoMedio,
            });
          }

          return {
            ...lote,
            total_animais: totalAnimais,
            total_machos: totalMachos,
            total_femeas: totalFemeas,
            peso_medio: Math.round(pesoMedio * 100) / 100,
          };
        })
      );

      setLotes(lotesComContagem);

      if (planoAtual) {
        setAtingiuLimite(
          lotesData.length >= planoAtual.limites.lotes
        );
      }
    } catch (error) {
      console.error('Erro ao carregar lotes:', error);
      alert('Erro ao carregar lotes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este lote?')) {
      try {
        await lotesAPI.delete(id);
        await carregarLotes();
        alert('Lote excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir lote:', error);
        alert('Erro ao excluir lote');
      }
    }
  };

  const handleNovoLote = () => {
    const verificacao = podeAdicionar('lotes', lotes.length);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/lotes/novo');
  };

  const filteredLotes = lotes.filter((lote) => {
    const matchesSearch = lote.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'todos' || lote.tipo?.toLowerCase() === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  const totalLotes = lotes.length;
  const totalAnimais = lotes.reduce((acc, lote) => acc + (lote.total_animais || 0), 0);
  const pesoMedio = lotes.length > 0
    ? Math.round(lotes.reduce((acc, lote) => acc + (lote.peso_medio || 0), 0) / lotes.length)
    : 0;

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Lotes</h2>
          <p>Gerencie os lotes de sua propriedade</p>
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
          <img src={iconLotes} alt="Lotes" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Lotes
        </h2>
        <p>Gerencie os lotes de sua propriedade</p>
      </div>

      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>
                  Seu {plano?.nome} permite no máximo {plano?.limites.lotes} lotes.
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
            <h3>Total de Lotes</h3>
            <div className="stat-number">{totalLotes}</div>
            <div className="stat-detail">Limite: {plano?.limites.lotes}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Total de Animais</h3>
            <div className="stat-number">{totalAnimais}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Peso Médio</h3>
            <div className="stat-number">{pesoMedio} kg</div>
          </div>
        </div>

        <button
          className="btn-novo"
          onClick={handleNovoLote}
          disabled={atingiuLimite}
          style={{
            opacity: atingiuLimite ? 0.5 : 1,
            cursor: atingiuLimite ? 'not-allowed' : 'pointer',
          }}
        >
          + Novo Lote
        </button>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input
                type="text"
                placeholder="Buscar por código do lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Tipo:</label>
              <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="pasto">Pasto</option>
                <option value="confinamento">Confinamento</option>
                <option value="quarentena">Quarentena</option>
                <option value="recria">Recria</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Área (m²)</th>
                <th>Animais</th>
                <th>Tipo</th>
                <th>Peso Médio (Kg)</th>
                <th>Machos</th>
                <th>Fêmeas</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLotes.map((lote) => (
                <tr key={lote.id}>
                  <td><strong>{lote.codigo}</strong></td>
                  <td>{lote.area || '-'}</td>
                  <td>
                    <span style={{ fontWeight: 'bold', color: '#3498db' }}>
                      {lote.total_animais || 0}
                    </span>
                  </td>
                  <td>{lote.tipo || 'Pasto'}</td>
                  <td>{lote.peso_medio ? `${lote.peso_medio} kg` : '-'}</td>
                  <td>{lote.total_machos || 0}</td>
                  <td>{lote.total_femeas || 0}</td>
                  <td>
                    <span className={`status-badge ${lote.status === 'Ativo' ? 'applied' : 'pending'}`}>
                      {lote.status || 'Ativo'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/lotes/editar/${lote.id}`)}>
                      <img src={editar} alt="Editar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn view" onClick={() => navigate(`/lotes/visualizar/${lote.id}`)}>
                      <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(lote.id)}>
                      <img src={excluir} alt="Excluir" className="icon icon-sm icon-hover" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLotes.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty-message">Nenhum lote encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Lotes;