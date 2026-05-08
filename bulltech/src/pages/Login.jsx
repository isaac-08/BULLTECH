import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const admin = users.find(u => u.email === email && u.senha === senha);

      if (admin) {
        localStorage.setItem('currentUser', JSON.stringify({
          id: admin.id,
          nome: admin.nome,
          email: admin.email,
          fazenda: admin.fazenda,
          tipo: 'admin'
        }));
        navigate('/dashboard');
        setLoading(false);
        return;
      }

      const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
      const funcionario = funcionarios.find(f => f.email === email && f.senha === senha && f.status === 'Ativo');

      if (funcionario) {
        localStorage.setItem('currentUser', JSON.stringify({
          id: funcionario.id,
          nome: funcionario.nome,
          email: funcionario.email,
          cargo: funcionario.cargo,
          tipo: 'funcionario'
        }));
        navigate('/dashboard');
        setLoading(false);
        return;
      }

      setError('Email ou senha inválidos');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-page">
      <Navbar />
      
      <main className="login-main">
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h1>Login</h1>
              <p>Acesse sua conta BULLTECH</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="exemplo@gmail.com.br"
              />
            </div>
            
            <div className="form-group">
              <label>Senha</label>
              <input 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required 
                placeholder="********"
              />
            </div>
            
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            
            <div className="login-links">
              <Link to="/esqueci-senha" className="forgot-link">Esqueceu a senha?</Link>
              <p>Não tem uma conta? <Link to="/cadastro">CLIQUE AQUI</Link></p>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;