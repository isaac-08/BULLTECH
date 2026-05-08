import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NovoFuncionario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [planoLimite, setPlanoLimite] = useState(null);
  const [funcionariosAtuais, setFuncionariosAtuais] = useState(0);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    telefone: '',
    cargo: 'Tratador',
    nivelAcesso: 'VISUALIZADOR',
    salario: '',
    dataAdmissao: '',
    status: 'Ativo',
    observacoes: ''
  });

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
    // Carregar plano do usuário
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const plano = currentUser.plano || 'basico';
    
    const planos = {
      basico: { maxFuncionarios: 3, nome: 'Plano Básico' },
      profissional: { maxFuncionarios: 10, nome: 'Plano Profissional' },
      empresarial: { maxFuncionarios: 50, nome: 'Plano Empresarial' }
    };
    
    setPlanoLimite(planos[plano]);
    
    // Contar funcionários atuais
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    setFuncionariosAtuais(funcionarios.length);
  }, []);

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
    
    // Verificar limite do plano
    if (funcionariosAtuais >= planoLimite.maxFuncionarios) {
      alert(`Limite do plano atingido! Seu ${planoLimite.nome} permite no máximo ${planoLimite.maxFuncionarios} funcionários. Faça upgrade para adicionar mais.`);
      return;
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    
    if (formData.senha.length < 4) {
      alert('A senha deve ter no mínimo 4 caracteres');
      return;
    }
    
    setLoading(true);

    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    
    if (funcionarios.some(f => f.email === formData.email)) {
      alert('Email já cadastrado!');
      setLoading(false);
      return;
    }
    
    const newId = funcionarios.length > 0 ? Math.max(...funcionarios.map(f => f.id)) + 1 : 1;
    
    const novoFuncionario = {
      id: newId,
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      cpf: formData.cpf,
      telefone: formData.telefone,
      cargo: formData.cargo,
      nivelAcesso: formData.nivelAcesso,
      salario: parseFloat(formData.salario) || 0,
      dataAdmissao: formData.dataAdmissao,
      status: formData.status,
      observacoes: formData.observacoes,
      createdAt: new Date().toISOString()
    };
    
    funcionarios.push(novoFuncionario);
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    
    setTimeout(() => {
      setLoading(false);
      navigate('/funcionarios');
    }, 500);
  };

  return (
    <>
      <div className="welcome-section">
        <h2>Adicionar Funcionário</h2>
        <p>Cadastre um novo funcionário na propriedade</p>
      </div>
      
      <div className="page-content">
        {funcionariosAtuais >= planoLimite?.maxFuncionarios && (
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
        
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome Completo *</label>
              <input type="text" name="nome" onChange={handleChange} required placeholder="Ex: João Silva" />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" onChange={handleChange} required placeholder="funcionario@bulltech.com" />
            </div>
            
            <div className="form-group">
              <label>Senha *</label>
              <input type="password" name="senha" onChange={handleChange} required placeholder="Mínimo 4 caracteres" />
            </div>
            
            <div className="form-group">
              <label>Confirmar Senha *</label>
              <input type="password" name="confirmarSenha" onChange={handleChange} required placeholder="Digite a senha novamente" />
            </div>
            
            <div className="form-group">
              <label>CPF</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleCPFChange} placeholder="000.000.000-00" maxLength="14" />
            </div>
            
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" name="telefone" value={formData.telefone} onChange={handleTelefoneChange} placeholder="(11) 99999-9999" />
            </div>
            
            <div className="form-group">
              <label>Cargo *</label>
              <select name="cargo" onChange={handleChange} required>
                {cargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Nível de Acesso *</label>
              <select name="nivelAcesso" onChange={handleChange} required>
                {niveisAcesso.map(nivel => (
                  <option key={nivel.value} value={nivel.value}>{nivel.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Salário (R$)</label>
              <input type="number" step="0.01" name="salario" onChange={handleChange} placeholder="Ex: 3500.00" />
            </div>
            
            <div className="form-group">
              <label>Data de Admissão *</label>
              <input type="date" name="dataAdmissao" onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select name="status" onChange={handleChange}>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" onChange={handleChange} placeholder="Observações sobre o funcionário..."></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/funcionarios')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading || funcionariosAtuais >= planoLimite?.maxFuncionarios}>
              {loading ? 'Salvando...' : 'Cadastrar Funcionário'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovoFuncionario;