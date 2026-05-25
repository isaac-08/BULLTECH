import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { funcionariosAPI } from '../../services/api';

const EditarFuncionario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const cargos = [
    'Veterinário',
    'Tratador',
    'Administrativo',
    'Gerente',
    'Auxiliar',
    'Motorista',
    'Outros'
  ];

  const niveisAcesso = [
    { value: 'ADMIN', label: 'Administrador - Acesso total' },
    { value: 'VETERINARIO', label: 'Veterinário - Animais, Vacinas, Reprodução, Pesagens' },
    { value: 'TRATADOR', label: 'Tratador - Animais, Pesagens, Dietas' },
    { value: 'SECRETARIA', label: 'Secretaria - Funcionários, Estoque, Relatórios' },
    { value: 'VISUALIZADOR', label: 'Visualizador - Apenas visualização' }
  ];

  useEffect(() => {
    carregarFuncionario();
  }, [id]);

  const carregarFuncionario = async () => {
    try {
      setLoading(true);
      const data = await funcionariosAPI.getOne(id);
      // Converter nomes dos campos para o formato do formulário
      setFormData({
        ...data,
        data_admissao: data.data_admissao?.split('T')[0] || '',
        nivel_acesso: data.nivel_acesso || 'VISUALIZADOR'
      });
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      navigate('/funcionarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatarCPF = (valor) => {
    const cpf = valor.replace(/\D/g, '');
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  };

  const formatarTelefone = (valor) => {
    const tel = valor.replace(/\D/g, '');
    if (tel.length <= 2) return tel;
    if (tel.length <= 6) return `(${tel.slice(0, 2)}) ${tel.slice(2)}`;
    if (tel.length <= 10) return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`;
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 11)}`;
  };

  const handleCPFChange = (e) => {
    setFormData({ ...formData, cpf: formatarCPF(e.target.value) });
  };

  const handleTelefoneChange = (e) => {
    setFormData({ ...formData, telefone: formatarTelefone(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await funcionariosAPI.update(id, {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf || null,
        telefone: formData.telefone || null,
        cargo: formData.cargo,
        nivel_acesso: formData.nivel_acesso,
        salario: parseFloat(formData.salario) || 0,
        data_admissao: formData.data_admissao,
        status: formData.status,
        observacoes: formData.observacoes || null
      });
      alert('Funcionário atualizado com sucesso!');
      navigate('/funcionarios');
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      alert('Erro ao atualizar funcionário');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Editar Funcionário</h2>
          <p>Altere as informações do funcionário</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Editar Funcionário</h2>
        <p>Altere as informações do funcionário</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome Completo *</label>
              <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>CPF</label>
              <input type="text" name="cpf" value={formData.cpf || ''} onChange={handleCPFChange} maxLength="14" />
            </div>
            
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" name="telefone" value={formData.telefone || ''} onChange={handleTelefoneChange} />
            </div>
            
            <div className="form-group">
              <label>Cargo *</label>
              <select name="cargo" value={formData.cargo || 'Tratador'} onChange={handleChange} required>
                {cargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Nível de Acesso *</label>
              <select name="nivel_acesso" value={formData.nivel_acesso || 'VISUALIZADOR'} onChange={handleChange} required>
                {niveisAcesso.map(nivel => (
                  <option key={nivel.value} value={nivel.value}>{nivel.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Salário (R$)</label>
              <input type="number" step="0.01" name="salario" value={formData.salario || ''} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Data de Admissão *</label>
              <input type="date" name="data_admissao" value={formData.data_admissao || ''} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status || 'Ativo'} onChange={handleChange}>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" value={formData.observacoes || ''} onChange={handleChange}></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/funcionarios')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarFuncionario;