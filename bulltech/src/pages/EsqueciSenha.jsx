import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EsqueciSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (novaSenha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex !== -1) {
        users[userIndex].senha = novaSenha;
        localStorage.setItem('users', JSON.stringify(users));
        
        setSuccess('Senha alterada com sucesso! Redirecionando para o login...');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Email não encontrado. Verifique se o email está cadastrado.');
      }
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
              <h1>Recuperar Senha</h1>
              <p>Digite seu email e sua nova senha</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-group">
              <label>Email cadastrado</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="Digite seu email"
              />
            </div>
            
            <div className="form-group">
              <label>Nova Senha</label>
              <input 
                type="password" 
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required 
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            
            <div className="form-group">
              <label>Confirmar Nova Senha</label>
              <input 
                type="password" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required 
                placeholder="Digite a senha novamente"
              />
            </div>
            
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </button>
            
            <div className="login-links">
              <Link to="/login">← Voltar para o login</Link>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EsqueciSenha;