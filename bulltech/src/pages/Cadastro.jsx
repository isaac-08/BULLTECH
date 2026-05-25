import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../services/supabase';

const Cadastro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Etapa 1 - Dados da Fazenda
    nomeFazenda: '',
    cnpj: '',
    inscricaoEstadual: '',
    dataFundacao: '',
    tipoProducao: '',
    // Etapa 2 - Contato
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    cidade: '',
    numero: '',
    estado: '',
    bairro: '',
    // Etapa 3 - Acesso
    nomeCompleto: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Função para buscar CEP
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    
    setLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
          cep: formatarCEP(cepLimpo)
        }));
        setError('');
      } else {
        setError('CEP não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setError('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (e) => {
    const valor = e.target.value;
    const cepFormatado = formatarCEP(valor);
    
    setFormData({
      ...formData,
      cep: cepFormatado
    });
    
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      buscarCep(cepLimpo);
    }
  };

  const formatarCNPJ = (valor) => {
    const cnpj = valor.replace(/\D/g, '');
    if (cnpj.length <= 2) return cnpj;
    if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
  };

  const formatarCEP = (valor) => {
    const cep = valor.replace(/\D/g, '');
    if (cep.length <= 5) return cep;
    return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
  };

  const formatarTelefone = (valor) => {
    const tel = valor.replace(/\D/g, '');
    if (tel.length <= 2) return tel;
    if (tel.length <= 6) return `(${tel.slice(0, 2)}) ${tel.slice(2)}`;
    if (tel.length <= 10) return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`;
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 11)}`;
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.nomeFazenda || !formData.cnpj) {
        setError('Preencha os campos obrigatórios da fazenda');
        return;
      }
    }
    if (step === 2) {
      if (!formData.email || !formData.telefone) {
        setError('Preencha os campos de contato');
        return;
      }
    }
    setStep(step + 1);
    setError('');
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 3) {
      if (!formData.nomeCompleto || !formData.senha) {
        setError('Preencha todos os campos de acesso');
        return;
      }
      
      if (formData.senha !== formData.confirmarSenha) {
        setError('As senhas não coincidem');
        return;
      }

      if (formData.senha.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres');
        return;
      }

      setLoading(true);

      try {
        // Registrar no Supabase
        const result = await authAPI.register(
          formData.email, 
          formData.senha, 
          formData.nomeCompleto, 
          formData.nomeFazenda
        );

        if (result.user) {
          // Atualizar o perfil com mais informações
          const { error: updateError } = await supabase
            .from('usuarios')
            .update({
              cnpj: formData.cnpj,
              telefone: formData.telefone,
              endereco: `${formData.endereco}, ${formData.numero} - ${formData.bairro}, ${formData.cidade} - ${formData.estado}`,
              cep: formData.cep,
              cidade: formData.cidade,
              estado: formData.estado,
              tipo_producao: formData.tipoProducao
            })
            .eq('auth_id', result.user.id);

          if (updateError) {
            console.error('Erro ao atualizar perfil:', updateError);
          }

          localStorage.setItem('currentUser', JSON.stringify({
            id: result.user.id,
            nome: formData.nomeCompleto,
            email: formData.email,
            fazenda: formData.nomeFazenda
          }));
          
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Erro no cadastro:', err);
        setError(err.message || 'Erro ao cadastrar. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      nextStep();
    }
  };

  const tiposProducao = [
    'Pecuária de Corte',
    'Pecuária de Leite',
  ];

  return (
    <div className="cadastro-page">
      <Navbar />
      
      <main className="cadastro-main">
        <div className="cadastro-container">
          <form className="cadastro-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h1>Comece sua Jornada</h1>
              <p>O seu sucesso é único e vamos ajudar você a gerenciar sua fazenda</p>
            </div>

            {/* Indicador de etapas */}
            <div className="steps-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Dados da Fazenda</div>
              </div>
              <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Contato</div>
              </div>
              <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Acesso</div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {/* Etapa 1 - Dados da Fazenda */}
            {step === 1 && (
              <div className="step-content">
                <h3>Informações da Fazenda</h3>
                
                <div className="form-group">
                  <label>Nome da Fazenda *</label>
                  <input 
                    type="text" 
                    name="nomeFazenda"
                    value={formData.nomeFazenda}
                    onChange={handleChange}
                    required 
                    placeholder="Digite o nome da sua fazenda"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CNPJ *</label>
                    <input 
                      type="text" 
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({...formData, cnpj: formatarCNPJ(e.target.value)})}
                      required 
                      placeholder="XX.XXX.XXX/YYYY-ZZ"
                      maxLength="18"
                    />
                  </div>
                  <div className="form-group">
                    <label>Data de Fundação</label>
                    <input 
                      type="date" 
                      name="dataFundacao"
                      value={formData.dataFundacao}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tipo de Produção</label>
                  <select 
                    name="tipoProducao"
                    value={formData.tipoProducao}
                    onChange={handleChange}
                  >
                    <option value="">Selecione...</option>
                    {tiposProducao.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Etapa 2 - Contato */}
            {step === 2 && (
              <div className="step-content">
                <h3>Informações de Contato</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>E-mail *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      placeholder="contato@fazenda.com.br"
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone *</label>
                    <input 
                      type="tel" 
                      name="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: formatarTelefone(e.target.value)})}
                      required 
                      placeholder="(11) 99999-9999"
                      maxLength="15"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CEP</label>
                    <input 
                      type="text" 
                      name="cep"
                      value={formData.cep}
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      maxLength="9"
                    />
                    {loadingCep && <span className="loading-cep">Buscando endereço...</span>}
                  </div>
                  <div className="form-group">
                    <label>Endereço</label>
                    <input 
                      type="text" 
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Bairro</label>
                    <input 
                      type="text" 
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      placeholder="Bairro"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cidade</label>
                    <input 
                      type="text" 
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      placeholder="Sua cidade"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Estado</label>
                    <input 
                      type="text" 
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      placeholder="UF"
                      maxLength="2"
                    />
                  </div>
                  <div className="form-group">
                    <label>Número</label>
                    <input 
                      type="text" 
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      placeholder="Número"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 3 - Acesso */}
            {step === 3 && (
              <div className="step-content">
                <h3>Dados de Acesso</h3>

                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input 
                    type="text" 
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    required 
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Senha *</label>
                    <input 
                      type="password" 
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      required 
                      placeholder="Mínimo 6 caracteres"
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
                </div>
              </div>
            )}
            
            <div className="form-navigation">
              {step > 1 && (
                <button type="button" className="btn-prev" onClick={prevStep}>
                  ← Anterior
                </button>
              )}
              <button type="submit" className="btn-next" disabled={loading}>
                {loading ? 'Cadastrando...' : (step === 3 ? 'Concluir Cadastro' : 'Próximo →')}
              </button>
            </div>
            
            <div className="cadastro-links">
              <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cadastro;