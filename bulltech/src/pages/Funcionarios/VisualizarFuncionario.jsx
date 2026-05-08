import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VisualizarFuncionario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const found = funcionarios.find(f => f.id === parseInt(id));
    if (found) {
      setFuncionario(found);
    } else {
      navigate('/funcionarios');
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Visualizar Funcionário</h2>
          <p>Veja os detalhes do funcionário</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!funcionario) {
    return null;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Visualizar Funcionário</h2>
        <p>Veja os detalhes do funcionário</p>
      </div>
      
      <div className="page-content">
        <div className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>ID</label>
              <p className="view-value">{funcionario.id}</p>
            </div>
            
            <div className="form-group">
              <label>Nome Completo</label>
              <p className="view-value">{funcionario.nome}</p>
            </div>
            
            <div className="form-group">
              <label>CPF</label>
              <p className="view-value">{funcionario.cpf}</p>
            </div>
            
            <div className="form-group">
              <label>Data de Nascimento</label>
              <p className="view-value">{funcionario.dataNascimento || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Telefone</label>
              <p className="view-value">{funcionario.telefone}</p>
            </div>
            
            <div className="form-group">
              <label>E-mail</label>
              <p className="view-value">{funcionario.email || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Cargo</label>
              <p className="view-value">{funcionario.cargo}</p>
            </div>
            
            <div className="form-group">
              <label>Salário</label>
              <p className="view-value">R$ {funcionario.salario?.toFixed(2)}</p>
            </div>
            
            <div className="form-group">
              <label>Data de Admissão</label>
              <p className="view-value">{funcionario.dataAdmissao}</p>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <p className="view-value">
                <span className={`status-badge ${funcionario.status === 'Ativo' ? 'applied' : 'pending'}`}>
                  {funcionario.status}
                </span>
              </p>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <p className="view-value">{funcionario.observacoes || 'Nenhuma observação'}</p>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn-edit" onClick={() => navigate(`/funcionarios/editar/${funcionario.id}`)}>
              Editar Funcionário
            </button>
            <button className="btn-cancel" onClick={() => navigate('/funcionarios')}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarFuncionario;