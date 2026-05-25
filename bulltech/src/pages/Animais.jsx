import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animaisAPI } from '../services/api';
import { podeAdicionar, getPlanoAtual, getUsoAtual } from '../utils/limites';
import iconsAcoes from '../assets/icons/acoes';

const Animais = () => {
  const navigate = useNavigate();
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sexoFilter, setSexoFilter] = useState('Todos');
  const [plano, setPlano] = useState(null);
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  // Pegando os ícones de ações
  const { editar, visu, excluir } = iconsAcoes;

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    setPlano(planoAtual);
    carregarAnimais();
  }, []);

  const carregarAnimais = async () => {
    try {
      setLoading(true);
      const data = await animaisAPI.getAll();
      setAnimais(data);
      if (plano) {
        setAtingiuLimite(data.length >= plano.limites.animais);
      }
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
      alert('Erro ao carregar animais');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este animal?')) {
      try {
        await animaisAPI.delete(id);
        await carregarAnimais();
        alert('Animal excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir animal:', error);
        alert('Erro ao excluir animal');
      }
    }
  };

  const handleNovoAnimal = () => {
    const verificacao = podeAdicionar('animais', animais.length);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/animais/novo');
  };

  const filteredAnimais = animais.filter(animal => {
    const matchesSearch = animal.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.brinco?.includes(searchTerm);
    const matchesStatus = statusFilter === 'Todos' || animal.status === statusFilter;
    const matchesSexo = sexoFilter === 'Todos' || animal.sexo === sexoFilter;
    return matchesSearch && matchesStatus && matchesSexo;
  });

  const totalAnimais = animais.length;
  const totalMachos = animais.filter(a => a.sexo === 'Macho').length;
  const totalFemeas = animais.filter(a => a.sexo === 'Fêmea').length;
  const totalAtivos = animais.filter(a => a.status === 'Ativo').length;

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Animais</h2>
          <p>Gerencie todos os animais da sua fazenda</p>
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
        <h2>Animais</h2>
        <p>Gerencie todos os animais da sua fazenda</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.animais} animais. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Animais</h3>
            <div className="stat-number">{totalAnimais}</div>
            <div className="stat-detail">Limite: {plano?.limites.animais}</div>
          </div>
          
          <div className="stat-card-animais">
            <h3>Machos</h3>
            <div className="stat-number">{totalMachos}</div>
            <div className="stat-detail">Animais do sexo masculino</div>
          </div>
          
          <div className="stat-card-animais">
            <h3>Fêmeas</h3>
            <div className="stat-number">{totalFemeas}</div>
            <div className="stat-detail">Animais do sexo feminino</div>
          </div>
          
          <div className="stat-card-animais">
            <h3>Ativos</h3>
            <div className="stat-number">{totalAtivos}</div>
            <div className="stat-detail">Animais em atividade</div>
          </div>
        </div>

        <button 
          className="btn-novo" 
          onClick={handleNovoAnimal}
          disabled={atingiuLimite}
          style={{ opacity: atingiuLimite ? 0.5 : 1, cursor: atingiuLimite ? 'not-allowed' : 'pointer' }}
        >
          + Novo Animal
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
            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>Todos</option>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sexo:</label>
              <select value={sexoFilter} onChange={(e) => setSexoFilter(e.target.value)}>
                <option>Todos</option>
                <option>Macho</option>
                <option>Fêmea</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>Brinco</th>
                <th>Nome</th>
                <th>Sexo</th>
                <th>Idade</th>
                <th>Peso (Kg)</th>
                <th>Lote</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnimais.map((animal) => (
                <tr key={animal.id}>
                  <td>{animal.brinco}</td>
                  <td>{animal.nome}</td>
                  <td>{animal.sexo}</td>
                  <td>{animal.idade || '-'}</td>
                  <td>{animal.peso ? `${animal.peso} kg` : '-'}</td>
                  <td>{animal.lote || '-'}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/animais/editar/${animal.id}`)}>
                      <img src={editar} alt="Editar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn view" onClick={() => navigate(`/animais/visualizar/${animal.id}`)}>
                      <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(animal.id)}>
                      <img src={excluir} alt="Excluir" className="icon icon-sm icon-hover" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAnimais.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-message">Nenhum animal encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Animais;