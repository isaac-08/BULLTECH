import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Funcionarios = () => {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cargoFilter, setCargoFilter] = useState('Todos');
  const [planoLimite, setPlanoLimite] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    // Carregar plano do usuário
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const plano = currentUser.plano || 'basico';
    
    const planos = {
      basico: { maxFuncionarios: 3, nome: 'Plano Básico' },
      profissional: { maxFuncionarios: 10, nome: 'Plano Profissional' },
      empresarial: { maxFuncionarios: 50, nome: 'Plano Empresarial' }
    };
    
    setPlanoLimite(planos[plano]);
    
    const storedFuncionarios = localStorage.getItem('funcionarios');
    if (storedFuncionarios) {
      setFuncionarios(JSON.parse(storedFuncionarios));
    } else {
      const initialFuncionarios = [
        { id: 1, nome: 'José Alves', cpf: '123.456.789-00', telefone: '(11) 99999-1111', email: 'jose@bulltech.com', cargo: 'Veterinário', salario: 8500.00, dataAdmissao: '10/01/2020', status: 'Ativo' },
        { id: 2, nome: 'Luiz Alencar', cpf: '234.567.890-11', telefone: '(11) 99999-2222', email: 'luiz@bulltech.com', cargo: 'Tratador', salario: 3200.00, dataAdmissao: '15/03/2021', status: 'Ativo' },
        { id: 3, nome: 'Maria Santos', cpf: '345.678.901-22', telefone: '(11) 99999-3333', email: 'maria@bulltech.com', cargo: 'Administrativo', salario: 4500.00, dataAdmissao: '01/08/2022', status: 'Ativo' }
      ];
      setFuncionarios(initialFuncionarios);
      localStorage.setItem('funcionarios', JSON.stringify(initialFuncionarios));
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      const newFuncionarios = funcionarios.filter(f => f.id !== id);
      setFuncionarios(newFuncionarios);
      localStorage.setItem('funcionarios', JSON.stringify(newFuncionarios));
      alert('Funcionário excluído com sucesso!');
    }
  };

  const filteredFuncionarios = funcionarios.filter(func => {
    const matchesSearch = func.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          func.cpf?.includes(searchTerm) ||
                          func.telefone?.includes(searchTerm);
    const matchesCargo = cargoFilter === 'Todos' || func.cargo === cargoFilter;
    return matchesSearch && matchesCargo;
  });

  const totalFuncionarios = funcionarios.length;
  const totalAtivos = funcionarios.filter(f => f.status === 'Ativo').length;
  const salarioTotal = funcionarios.reduce((acc, f) => acc + (f.salario || 0), 0);
  const salarioMedio = totalFuncionarios > 0 ? (salarioTotal / totalFuncionarios).toFixed(2) : 0;

  const cargos = ['Todos', ...new Set(funcionarios.map(f => f.cargo))];
  const atingiuLimite = totalFuncionarios >= planoLimite?.maxFuncionarios;

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
        <h2>Funcionários</h2>
        <p>Gerencie os funcionários da sua propriedade</p>
      </div>
      
      <div className="page-content">
        {/* Alerta de limite */}
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {planoLimite?.nome} permite no máximo {planoLimite?.maxFuncionarios} funcionários. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Cards de estatísticas */}
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Funcionários</h3>
            <div className="stat-number">{totalFuncionarios}</div>
            <div className="stat-detail">Limite: {planoLimite?.maxFuncionarios}</div>
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

        {/* Botão Novo Funcionário */}
        <button 
          className="btn-novo" 
          onClick={() => navigate('/funcionarios/novo')}
          disabled={atingiuLimite}
          style={{ opacity: atingiuLimite ? 0.5 : 1, cursor: atingiuLimite ? 'not-allowed' : 'pointer' }}
        >
          + Novo Funcionário
        </button>

        {/* Filtros */}
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
                {cargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
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
                  <td>{func.cpf}</td>
                  <td>{func.cargo}</td>
                  <td>{func.telefone}</td>
                  <td>{func.email}</td>
                  <td>R$ {func.salario?.toFixed(2)}</td>
                  <td className="actions-cell">
                    <span className={`status-badge ${func.status === 'Ativo' ? 'applied' : 'pending'}`}>
                      {func.status}
                    </span>
                    </td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/funcionarios/editar/${func.id}`)}>✏️</button>
                    <button className="action-btn view" onClick={() => navigate(`/funcionarios/visualizar/${func.id}`)}>👁️</button>
                    <button className="action-btn delete" onClick={() => handleDelete(func.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {filteredFuncionarios.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty-message">Nenhum funcionário encontrado</td>
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