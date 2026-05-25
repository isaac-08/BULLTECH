import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
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
  const [step, setStep] = useState(1);

  // Passo 1: Verificar se o email existe
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verificar se o usuário existe no auth
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      });

      if (error) throw error;

      setSuccess(`Email de recuperação enviado para ${email}! Verifique sua caixa de entrada.`);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Email não encontrado ou erro ao enviar recuperação.');
    } finally {
      setLoading(false);
    }
  };

  // Passo 2: Atualizar senha (se tiver token)
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (novaSenha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: novaSenha
      });

      if (error) throw error;

      setSuccess('Senha alterada com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao alterar senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      
      <main className="login-main">
        <div className="login-container">
          <form className="login-form" onSubmit={step === 1 ? handleCheckEmail : handleUpdatePassword}>
            <div className="form-header">
              <h1>{step === 1 ? 'Recuperar Senha' : 'Nova Senha'}</h1>
              <p>{step === 1 ? 'Digite seu email para receber o link de recuperação' : 'Digite sua nova senha'}</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {step === 1 && (
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
            )}
            
            {step === 2 && (
              <>
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
              </>
            )}
            
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Processando...' : (step === 1 ? 'Enviar Link' : 'Alterar Senha')}
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