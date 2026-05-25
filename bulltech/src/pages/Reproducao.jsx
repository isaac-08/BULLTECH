import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reproducoesAPI } from '../services/api';
import { podeAdicionar, getPlanoAtual } from '../utils/limites';
import iconsAcoes from '../assets/icons/acoes';
import iconsDash from '../assets/icons/dash';
import iconsRelat from '../assets/icons/relat';

const Reproducao = () => {
  const navigate = useNavigate();
  const [reproducoes, setReproducoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [resultadoFilter, setResultadoFilter] = useState('Todos');
  const [plano, setPlano] = useState(null);
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  const { editar, visu, excluir } = iconsAcoes;
  const { animais: iconAnimais } = iconsDash;
  const { data: iconData, grafico: iconGrafico } = iconsRelat;

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    setPlano(planoAtual);
    carregarReproducoes();
  }, []);

  const carregarReproducoes = async () => {
    try {
      setLoading(true);
      const data = await reproducoesAPI.getAll();
      setReproducoes(data);
      if (plano) {
        setAtingiuLimite(data.length >= plano.limites.reproducoes);
      }
    } catch (error) {
      console.error('Erro ao carregar reproduções:', error);
      alert('Erro ao carregar reproduções');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await reproducoesAPI.delete(id);
        await carregarReproducoes();
        alert('Registro excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir registro:', error);
        alert('Erro ao excluir registro');
      }
    }
  };

  const handleNovoRegistro = () => {
    const verificacao = podeAdicionar('reproducoes', reproducoes.length);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/reproducao/novo');
  };

  const filteredReproducoes = reproducoes.filter(reg => {
    const matchesSearch = reg.animal_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          reg.animal_brinco?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'Todos' || reg.tipo === tipoFilter;
    const matchesResultado = resultadoFilter === 'Todos' || reg.resultado === resultadoFilter;
    return matchesSearch && matchesTipo && matchesResultado;
  });

  const totalEventos = reproducoes.length;

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Reprodução</h2>
          <p>Gerencie os eventos reprodutivos do seu rebanho</p>
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
          <img src={iconData} alt="Reprodução" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Reprodução
        </h2>
        <p>Gerencie os eventos reprodutivos do seu rebanho</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.reproducoes} registros de reprodução. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>
              <img src={iconGrafico} alt="Eventos" className="icon icon-xs" style={{ marginRight: '5px' }} />
              Total de Eventos
            </h3>
            <div className="stat-number">{totalEventos}</div>
            <div className="stat-detail">Limite: {plano?.limites.reproducoes}</div>
          </div>
        </div>

        <button 
          className="btn-novo" 
          onClick={handleNovoRegistro}
          disabled={atingiuLimite}
          style={{ opacity: atingiuLimite ? 0.5 : 1, cursor: atingiuLimite ? 'not-allowed' : 'pointer' }}
        >
          + Novo Registro
        </button>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input 
                type="text" 
                placeholder="Buscar por animal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Tipo:</label>
              <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                <option>Todos</option>
                <option>Cobertura</option>
                <option>Inseminação</option>
                <option>Parto</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Resultado:</label>
              <select value={resultadoFilter} onChange={(e) => setResultadoFilter(e.target.value)}>
                <option>Todos</option>
                <option>Prenha</option>
                <option>Não Prenha</option>
                <option>Sucesso</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>Animal</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Resultado</th>
                <th>Crias</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReproducoes.map((reg) => (
                <tr key={reg.id}>
                  <td>
                    <img src={iconAnimais} alt="Animal" className="icon icon-xs" style={{ marginRight: '5px' }} />
                    {reg.animal_nome}
                  </td>
                  <td>{reg.tipo}</td>
                  <td>{reg.data_evento ? new Date(reg.data_evento).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="actions-cell">
                    <span className={`status-badge ${reg.resultado === 'Prenha' || reg.resultado === 'Sucesso' ? 'applied' : 'pending'}`}>
                      {reg.resultado || '-'}
                    </span>
                    </td>
                  <td>{reg.crias_vivas > 0 ? `${reg.crias_vivas} vivas` : '-'}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/reproducao/editar/${reg.id}`)}>
                      <img src={editar} alt="Editar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn view" onClick={() => navigate(`/reproducao/visualizar/${reg.id}`)}>
                      <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(reg.id)}>
                      <img src={excluir} alt="Excluir" className="icon icon-sm icon-hover" />
                    </button>
                   </td>
                 </tr>
              ))}
              {filteredReproducoes.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-message">
                    <img src={iconData} alt="Reprodução" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <br />Nenhum registro encontrado
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

export default Reproducao;