import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // VERIFICAÇÃO ESPECIAL PARA ADMIN
      if (email === 'admin@gmail.com' && senha === 'admadm') {
        // Salvar admin no localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          id: 'admin',
          nome: 'Administrador',
          email: 'admin@gmail.com',
          fazenda: 'BULLTECH System',
          tipo: 'admin',
          isAdmin: true
        }));
        
        setLoading(false);
        navigate('/admin');
        return;
      }

      // Login normal para usuários comuns
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (signInError) {
        console.error('Erro no signIn:', signInError);
        throw signInError;
      }

      if (data?.user) {
        // Buscar o perfil do usuário na tabela 'usuarios'
        const { data: profile, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('auth_id', data.user.id)
          .single();

        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError);
        }

        // Verificar se o usuário é admin pelo perfil
        const isAdmin = profile?.tipo === 'admin' || profile?.email === 'admin@gmail.com';

        // Salvar no localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          id: profile?.id || data.user.id,
          nome: profile?.nome || data.user.email,
          email: data.user.email,
          fazenda: profile?.fazenda || '',
          tipo: isAdmin ? 'admin' : (profile?.tipo || 'usuario'),
          isAdmin: isAdmin
        }));
        
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
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