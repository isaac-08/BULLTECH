import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const LoginFuncionario = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatarCPF = (valor) => {
    const cpf = valor.replace(/\D/g, '');
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const funcionario = funcionarios.find(f => 
      f.cpf === formatarCPF(cpf) && f.status === 'Ativo'
    );

    setTimeout(() => {
      if (funcionario) {
        // Salvar funcionário logado
        localStorage.setItem('funcionarioLogado', JSON.stringify({
          id: funcionario.id,
          nome: funcionario.nome,
          cpf: funcionario.cpf,
          cargo: funcionario.cargo,
          nivelAcesso: funcionario.nivelAcesso || 'VISUALIZADOR'
        }));
        navigate('/dashboard');
      } else {
        setError('CPF não encontrado ou funcionário inativo');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, width: '100%' }}>
        <div className="page-header">
          <h1>Acesso Funcionário</h1>
          <p>Entre com seu CPF para acessar o sistema</p>
        </div>

        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>CPF:</label>
              <input 
                type="text" 
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                required 
                placeholder="000.000.000-00"
                maxLength="14"
              />
            </div>
            
            <div className="form-group">
              <label>Senha (Data de Nascimento):</label>
              <input 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required 
                placeholder="DD/MM/AAAA"
              />
            </div>
            
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            
            <div className="login-links">
              <p>Funcionário? <a href="/login">Acessar como Administrador</a></p>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginFuncionario;