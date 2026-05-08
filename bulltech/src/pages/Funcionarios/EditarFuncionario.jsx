import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

  useEffect(() => {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const found = funcionarios.find(f => f.id === parseInt(id));
    if (found) {
      setFormData(found);
    } else {
      navigate('/funcionarios');
    }
    setLoading(false);
  }, [id, navigate]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const index = funcionarios.findIndex(f => f.id === parseInt(id));
    
    if (index !== -1) {
      funcionarios[index] = { 
        ...formData, 
        salario: parseFloat(formData.salario) || 0,
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    }
    
    setTimeout(() => {
      setSaving(false);
      navigate('/funcionarios');
    }, 500);
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
              <label>CPF *</label>
              <input type="text" name="cpf" value={formData.cpf || ''} onChange={handleCPFChange} required />
            </div>
            
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input type="date" name="dataNascimento" value={formData.dataNascimento || ''} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Telefone *</label>
              <input type="tel" name="telefone" value={formData.telefone || ''} onChange={handleTelefoneChange} required />
            </div>
            
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
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
              <label>Salário (R$)</label>
              <input type="number" step="0.01" name="salario" value={formData.salario || ''} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Data de Admissão *</label>
              <input type="date" name="dataAdmissao" value={formData.dataAdmissao || ''} onChange={handleChange} required />
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