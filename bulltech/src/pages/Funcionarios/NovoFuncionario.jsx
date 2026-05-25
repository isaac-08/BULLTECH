import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { funcionariosAPI } from '../../services/api';
import { podeAdicionar, getPlanoAtual } from '../../utils/limites';

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
    nivel_acesso: 'VISUALIZADOR',
    salario: '',
    data_admissao: '',
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

  // Carregar plano e funcionários atuais
  React.useEffect(() => {
    const carregarLimites = async () => {
      try {
        const plano = getPlanoAtual();
        setPlanoLimite(plano);
        
        const funcionarios = await funcionariosAPI.getAll();
        setFuncionariosAtuais(funcionarios.length);
      } catch (error) {
        console.error('Erro ao carregar limites:', error);
      }
    };
    carregarLimites();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar limite do plano
    if (funcionariosAtuais >= planoLimite?.limites?.funcionarios) {
      alert(`Limite do plano atingido! Seu ${planoLimite?.nome} permite no máximo ${planoLimite?.limites?.funcionarios} funcionários. Faça upgrade para adicionar mais.`);
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

    try {
      // Preparar dados para enviar ao Supabase
      const dadosParaEnviar = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf || null,
        telefone: formData.telefone || null,
        cargo: formData.cargo,
        nivel_acesso: formData.nivel_acesso,
        salario: parseFloat(formData.salario) || 0,
        data_admissao: formData.data_admissao,
        status: formData.status,
        observacoes: formData.observacoes || null
      };
      
      console.log('Enviando dados do funcionário:', dadosParaEnviar);
      await funcionariosAPI.create(dadosParaEnviar);
      alert(`Funcionário ${formData.nome} cadastrado com sucesso!`);
      navigate('/funcionarios');
    } catch (error) {
      console.error('Erro detalhado ao cadastrar funcionário:', error);
      alert(`Erro ao cadastrar funcionário: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="welcome-section">
        <h2>👥 Adicionar Funcionário</h2>
        <p>Cadastre um novo funcionário na propriedade</p>
      </div>
      
      <div className="page-content">
        {funcionariosAtuais >= planoLimite?.limites?.funcionarios && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {planoLimite?.nome} permite no máximo {planoLimite?.limites?.funcionarios} funcionários. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome Completo *</label>
              <input 
                type="text" 
                name="nome" 
                value={formData.nome}
                onChange={handleChange} 
                required 
                placeholder="Ex: João Silva" 
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange} 
                required 
                placeholder="funcionario@bulltech.com" 
              />
            </div>
            
            <div className="form-group">
              <label>Senha *</label>
              <input 
                type="password" 
                name="senha" 
                value={formData.senha}
                onChange={handleChange} 
                required 
                placeholder="Mínimo 4 caracteres" 
              />
            </div>
            
            <div className="form-group">
              <label>Confirmar Senha *</label>
              <input 
                type="password" 
                name="confirmarSenha" 
                value={formData.confirmarSenha}
                onChange={handleChange} 
                required 
                placeholder="Digite a senha novamente" 
              />
            </div>
            
            <div className="form-group">
              <label>CPF</label>
              <input 
                type="text" 
                name="cpf" 
                value={formData.cpf} 
                onChange={handleCPFChange} 
                placeholder="000.000.000-00" 
                maxLength="14" 
              />
            </div>
            
            <div className="form-group">
              <label>Telefone</label>
              <input 
                type="tel" 
                name="telefone" 
                value={formData.telefone} 
                onChange={handleTelefoneChange} 
                placeholder="(11) 99999-9999" 
              />
            </div>
            
            <div className="form-group">
              <label>Cargo *</label>
              <select name="cargo" value={formData.cargo} onChange={handleChange} required>
                {cargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Nível de Acesso *</label>
              <select name="nivel_acesso" value={formData.nivel_acesso} onChange={handleChange} required>
                {niveisAcesso.map(nivel => (
                  <option key={nivel.value} value={nivel.value}>{nivel.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Salário (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                name="salario" 
                value={formData.salario}
                onChange={handleChange} 
                placeholder="Ex: 3500.00" 
              />
            </div>
            
            <div className="form-group">
              <label>Data de Admissão *</label>
              <input 
                type="date" 
                name="data_admissao" 
                value={formData.data_admissao}
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea 
                name="observacoes" 
                rows="3" 
                value={formData.observacoes}
                onChange={handleChange} 
                placeholder="Observações sobre o funcionário..."
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/funcionarios')}>Cancelar</button>
            <button 
              type="submit" 
              className="btn-save" 
              disabled={loading || funcionariosAtuais >= planoLimite?.limites?.funcionarios}
            >
              {loading ? 'Salvando...' : 'Cadastrar Funcionário'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovoFuncionario;