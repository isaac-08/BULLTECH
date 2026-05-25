import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { funcionariosAPI } from '../../services/api';

const VisualizarFuncionario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFuncionario();
  }, [id]);

  const carregarFuncionario = async () => {
    try {
      setLoading(true);
      const data = await funcionariosAPI.getOne(id);
      setFuncionario(data);
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      navigate('/funcionarios');
    } finally {
      setLoading(false);
    }
  };

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

  const niveisAcessoLabel = {
    ADMIN: 'Administrador',
    VETERINARIO: 'Veterinário',
    TRATADOR: 'Tratador',
    SECRETARIA: 'Secretaria',
    VISUALIZADOR: 'Visualizador'
  };

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
              <label>Email</label>
              <p className="view-value">{funcionario.email}</p>
            </div>
            
            <div className="form-group">
              <label>CPF</label>
              <p className="view-value">{funcionario.cpf || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Telefone</label>
              <p className="view-value">{funcionario.telefone || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Cargo</label>
              <p className="view-value">{funcionario.cargo}</p>
            </div>
            
            <div className="form-group">
              <label>Nível de Acesso</label>
              <p className="view-value">{niveisAcessoLabel[funcionario.nivel_acesso] || funcionario.nivel_acesso}</p>
            </div>
            
            <div className="form-group">
              <label>Salário</label>
              <p className="view-value">R$ {(funcionario.salario || 0).toFixed(2)}</p>
            </div>
            
            <div className="form-group">
              <label>Data de Admissão</label>
              <p className="view-value">{funcionario.data_admissao ? new Date(funcionario.data_admissao).toLocaleDateString('pt-BR') : '-'}</p>
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