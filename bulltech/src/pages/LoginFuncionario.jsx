import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LoginFuncionario = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formatarCPF = (valor) => {
    const cpf = valor.replace(/\D/g, '');
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cpfFormatado = formatarCPF(cpf);
      
      // Buscar funcionário no Supabase pelo CPF e senha
      const { data: funcionario, error: fetchError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('cpf', cpfFormatado)
        .eq('senha', senha)
        .eq('status', 'Ativo')
        .single();

      if (fetchError || !funcionario) {
        throw new Error('CPF ou senha inválidos, ou funcionário inativo');
      }

      // Salvar funcionário logado no localStorage
      localStorage.setItem('funcionarioLogado', JSON.stringify({
        id: funcionario.id,
        nome: funcionario.nome,
        cpf: funcionario.cpf,
        email: funcionario.email,
        cargo: funcionario.cargo,
        nivel_acesso: funcionario.nivel_acesso || 'VISUALIZADOR',
        telefone: funcionario.telefone,
        data_admissao: funcionario.data_admissao
      }));
      
      // Redirecionar baseado no nível de acesso
      if (funcionario.nivel_acesso === 'ADMIN') {
        navigate('/dashboard');
      } else if (funcionario.nivel_acesso === 'VETERINARIO') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="login-container" style={{
          maxWidth: '450px',
          width: '100%',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h1 style={{ color: '#2c3e50', fontSize: '28px', marginBottom: '10px' }}>
              👥 Acesso Funcionário
            </h1>
            <p style={{ color: '#666' }}>Entre com seu CPF e senha para acessar o sistema</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {error && (
              <div style={{
                background: '#fee',
                color: '#e74c3c',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                CPF:
              </label>
              <input 
                type="text" 
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                required 
                placeholder="000.000.000-00"
                maxLength="14"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Senha:
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required 
                  placeholder="Digite sua senha"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    paddingRight: '45px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-login" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            
            <div className="login-links" style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ color: '#666' }}>
                Administrador? <a href="/login" style={{ color: '#3498db', textDecoration: 'none' }}>Acessar como Administrador</a>
              </p>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginFuncionario;