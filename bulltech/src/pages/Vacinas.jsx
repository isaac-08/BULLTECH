import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vacinasAPI } from '../services/api';
import { podeAdicionar, getPlanoAtual } from '../utils/limites';
import iconsAcoes from '../assets/icons/acoes';
import iconsDash from '../assets/icons/dash';

const Vacinas = () => {
  const navigate = useNavigate();
  const [vacinasAplicadas, setVacinasAplicadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [plano, setPlano] = useState(null);
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  const { editar, visu, excluir } = iconsAcoes;
  const { vacinas: iconVacinas } = iconsDash;

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    setPlano(planoAtual);
    carregarVacinas();
  }, []);

  const carregarVacinas = async () => {
    try {
      setLoading(true);
      const data = await vacinasAPI.getAll();
      setVacinasAplicadas(data);
      if (plano) {
        setAtingiuLimite(data.length >= plano.limites.vacinas);
      }
    } catch (error) {
      console.error('Erro ao carregar vacinas:', error);
      alert('Erro ao carregar vacinas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de vacina?')) {
      try {
        await vacinasAPI.delete(id);
        await carregarVacinas();
        alert('Registro de vacina excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir vacina:', error);
        alert('Erro ao excluir vacina');
      }
    }
  };

  const handleNovaVacina = () => {
    const verificacao = podeAdicionar('vacinas', vacinasAplicadas.length);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/vacinas/aplicar');
  };

  const filteredVacinas = vacinasAplicadas.filter(v => {
    const matchesSearch = v.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.animal_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.animal_brinco?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVacinas = vacinasAplicadas.length;
  const totalAplicadas = vacinasAplicadas.filter(v => v.status === 'Aplicada').length;
  const totalPendentes = vacinasAplicadas.filter(v => v.status === 'Pendente').length;
  const totalAnimaisVacinados = new Set(vacinasAplicadas.map(v => v.animal_id)).size;

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Vacinas Aplicadas</h2>
          <p>Histórico de vacinas aplicadas nos animais</p>
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
          <img src={iconVacinas} alt="Vacinas" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Vacinas Aplicadas
        </h2>
        <p>Histórico de vacinas aplicadas nos animais</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.vacinas} registros de vacinas. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Vacinas</h3>
            <div className="stat-number">{totalVacinas}</div>
            <div className="stat-detail">Registros no total</div>
          </div>
          <div className="stat-card-animais">
            <h3>Doses Aplicadas</h3>
            <div className="stat-number" style={{ color: '#27ae60' }}>{totalAplicadas}</div>
            <div className="stat-detail">Vacinas já aplicadas</div>
          </div>
          <div className="stat-card-animais">
            <h3>Doses Pendentes</h3>
            <div className="stat-number" style={{ color: '#e74c3c' }}>{totalPendentes}</div>
            <div className="stat-detail">Vacinas agendadas</div>
          </div>
          <div className="stat-card-animais">
            <h3>Animais Vacinados</h3>
            <div className="stat-number">{totalAnimaisVacinados}</div>
            <div className="stat-detail">Animais com registro</div>
          </div>
        </div>

        <div className="actions-bar" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button className="btn-novo" onClick={handleNovaVacina} disabled={atingiuLimite}>
            + Registrar Aplicação
          </button>
        </div>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input 
                type="text" 
                placeholder="Buscar por vacina, animal ou brinco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>Todos</option>
                <option>Aplicada</option>
                <option>Pendente</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Vacina</th>
                <th>Animal</th>
                <th>Brinco</th>
                <th>Dose</th>
                <th>Aplicador</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVacinas.map((vacina) => (
                <tr key={vacina.id}>
                  <td>{vacina.data_aplicacao ? new Date(vacina.data_aplicacao).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>{vacina.nome}</td>
                  <td>{vacina.animal_nome || '-'}</td>
                  <td>{vacina.animal_brinco || '-'}</td>
                  <td>{vacina.dose || '-'}</td>
                  <td>{vacina.aplicador || '-'}</td>
                  <td className="actions-cell">
                    <span className={`status-badge ${vacina.status === 'Aplicada' ? 'applied' : 'pending'}`}>
                      {vacina.status || 'Pendente'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/vacinas/editar/${vacina.id}`)}>
                      <img src={editar} alt="Editar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn view" onClick={() => navigate(`/vacinas/visualizar/${vacina.id}`)}>
                      <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(vacina.id)}>
                      <img src={excluir} alt="Excluir" className="icon icon-sm icon-hover" />
                    </button>
                   </td>
                 </tr>
              ))}
              {filteredVacinas.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-message">
                    <img src={iconVacinas} alt="Vacinas" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <br />Nenhuma vacina aplicada encontrada
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

export default Vacinas;