import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { funcionariosAPI } from '../services/api';
import { podeAdicionar, getPlanoAtual } from '../utils/limites';
import iconsAcoes from '../assets/icons/acoes';
import iconsDash from '../assets/icons/dash';
import iconsRelat from '../assets/icons/relat';

const Funcionarios = () => {
  const navigate = useNavigate();

  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cargoFilter, setCargoFilter] = useState('Todos');
  const [plano, setPlano] = useState(null);
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  const { editar, visu, excluir } = iconsAcoes;
  const { funcionarios: iconFuncionarios } = iconsDash;
  const { data: iconData } = iconsRelat;

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    setPlano(planoAtual);
    carregarFuncionarios(planoAtual);
  }, []);

  const carregarFuncionarios = async (planoAtual = plano) => {
    try {
      setLoading(true);
      const data = await funcionariosAPI.getAll();
      setFuncionarios(data || []);
      if (planoAtual) {
        setAtingiuLimite(data.length >= planoAtual.limites.funcionarios);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      alert('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await funcionariosAPI.delete(id);
        await carregarFuncionarios();
        alert('Funcionário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        alert('Erro ao excluir funcionário');
      }
    }
  };

  const handleNovoFuncionario = () => {
    const verificacao = podeAdicionar('funcionarios', funcionarios.length);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/funcionarios/novo');
  };

  const filteredFuncionarios = funcionarios.filter((func) => {
    const matchesSearch =
      func.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.cpf?.includes(searchTerm) ||
      func.telefone?.includes(searchTerm);
    const matchesCargo = cargoFilter === 'Todos' || func.cargo === cargoFilter;
    return matchesSearch && matchesCargo;
  });

  const totalFuncionarios = funcionarios.length;
  const totalAtivos = funcionarios.filter((f) => f.status === 'Ativo').length;
  const salarioTotal = funcionarios.reduce((acc, f) => acc + (f.salario || 0), 0);
  const salarioMedio = totalFuncionarios > 0 ? (salarioTotal / totalFuncionarios).toFixed(2) : 0;

  const cargos = ['Todos', ...new Set(funcionarios.map((f) => f.cargo).filter(Boolean))];

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Funcionários</h2>
          <p>Gerencie os funcionários da sua propriedade</p>
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
          <img src={iconFuncionarios} alt="Funcionários" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Funcionários
        </h2>
        <p>Gerencie os funcionários da sua propriedade</p>
      </div>

      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>
                  Seu {plano?.nome} permite no máximo {plano?.limites.funcionarios} funcionários.
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
              Total de Funcionários
            </h3>
            <div className="stat-number">{totalFuncionarios}</div>
            <div className="stat-detail">Limite: {plano?.limites.funcionarios}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Ativos</h3>
            <div className="stat-number" style={{ color: '#27ae60' }}>{totalAtivos}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Salário Médio</h3>
            <div className="stat-number">R$ {salarioMedio}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Folha Mensal</h3>
            <div className="stat-number">R$ {salarioTotal.toFixed(2)}</div>
          </div>
        </div>

        <button
          className="btn-novo"
          onClick={handleNovoFuncionario}
          disabled={atingiuLimite}
          style={{
            opacity: atingiuLimite ? 0.5 : 1,
            cursor: atingiuLimite ? 'not-allowed' : 'pointer',
          }}
        >
          + Novo Funcionário
        </button>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Cargo:</label>
              <select value={cargoFilter} onChange={(e) => setCargoFilter(e.target.value)}>
                {cargos.map((cargo) => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Cargo</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Salário</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFuncionarios.map((func) => (
                <tr key={func.id}>
                  <td>{func.id}</td>
                  <td>{func.nome}</td>
                  <td>{func.cpf || '-'}</td>
                  <td>{func.cargo}</td>
                  <td>{func.telefone || '-'}</td>
                  <td>{func.email || '-'}</td>
                  <td>R$ {(func.salario || 0).toFixed(2)}</td>
                  <td className="actions-cell">
                    <span className={`status-badge ${func.status === 'Ativo' ? 'applied' : 'pending'}`}>
                      {func.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/funcionarios/editar/${func.id}`)}>
                      <img src={editar} alt="Editar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn view" onClick={() => navigate(`/funcionarios/visualizar/${func.id}`)}>
                      <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(func.id)}>
                      <img src={excluir} alt="Excluir" className="icon icon-sm icon-hover" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredFuncionarios.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty-message" style={{ textAlign: 'center', padding: '40px' }}>
                    <img src={iconFuncionarios} alt="Funcionários" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <br />Nenhum funcionário encontrado
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

export default Funcionarios;