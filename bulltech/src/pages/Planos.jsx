import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bannerPlanos from '../assets/banner_planos.png';

// Ícones
import iconeBasico from '../assets/icons/basico.png';
import iconeProfissional from '../assets/icons/profissional.png';
import iconeEmpresarial from '../assets/icons/empresarial.png';
import iconeCheck from '../assets/icons/check.png';

const Planos = () => {
  const navigate = useNavigate();
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [periodo, setPeriodo] = useState('mensal');

  const planos = {
    BASICO: {
      id: 'basico',
      nome: 'Plano Básico',
      precoMensal: 99.90,
      precoAnual: 999.00,
      icone: iconeBasico,
      recursos: [
        '✓ Até 300 animais',
        '✓ Até 10 lotes',
        '✓ Até 10 funcionários',
        '✓ Vacinas ilimitadas',
        '✓ Pesagens ilimitadas',
        '✓ Relatórios básicos',
        '✓ Suporte por email'
      ]
    },
    PROFISSIONAL: {
      id: 'profissional',
      nome: 'Plano Profissional',
      precoMensal: 199.90,
      precoAnual: 1999.00,
      icone: iconeProfissional,
      recursos: [
        '✓ Até 1000 animais',
        '✓ Até 30 lotes',
        '✓ Até 25 funcionários',
        '✓ Vacinas ilimitadas',
        '✓ Pesagens ilimitadas',
        '✓ Relatórios básicos',
        '✓ Relatórios avançados',
        '✓ Suporte por email',
        '✓ Suporte WhatsApp'
      ]
    },
    EMPRESARIAL: {
      id: 'empresarial',
      nome: 'Plano Empresarial',
      precoMensal: 399.90,
      precoAnual: 3999.00,
      icone: iconeEmpresarial,
      recursos: [
        '✓ Animais ilimitados',
        '✓ Lotes ilimitados',
        '✓ Funcionários ilimitados',
        '✓ Vacinas ilimitadas',
        '✓ Pesagens ilimitadas',
        '✓ Relatórios básicos',
        '✓ Relatórios avançados',
        '✓ Relatórios personalizados',
        '✓ Suporte prioritário',
        '✓ API de acesso'
      ]
    }
  };

  const handleContratar = (planoId) => {
    setPlanoSelecionado(planoId);
    localStorage.setItem('planoSelecionado', JSON.stringify({
      id: planoId,
      nome: planos[planoId.toUpperCase()].nome,
      preco: periodo === 'mensal' ? planos[planoId.toUpperCase()].precoMensal : planos[planoId.toUpperCase()].precoAnual,
      periodo: periodo
    }));
    navigate('/checkout');
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  return (
    <div className="planos-page">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <img src={bannerPlanos} alt="Planos BULLTECH" className="hero-banner" />
        </section>

        {/* Seletor de período */}
        <section className="periodo-section">
          <div className="container">
            <div className="periodo-toggle">
              <button 
                className={`periodo-btn ${periodo === 'mensal' ? 'active' : ''}`}
                onClick={() => setPeriodo('mensal')}
              >
                Mensal
              </button>
              <button 
                className={`periodo-btn ${periodo === 'anual' ? 'active' : ''}`}
                onClick={() => setPeriodo('anual')}
              >
                Anual
                <span className="economia-badge">Economize 15%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Planos */}
        <section className="planos-section">
          <div className="container">
            <div className="planos-grid">
              {Object.entries(planos).map(([key, plano]) => (
                <div key={key} className="plano-card">
                  <div className="plano-header">
                    <div className="plano-icon">
                      <img src={plano.icone} alt={plano.nome} />
                    </div>
                    <h3>{plano.nome}</h3>
                  </div>
                  
                  <div className="plano-preco">
                    <span className="preco-valor">
                      {formatarPreco(periodo === 'mensal' ? plano.precoMensal : plano.precoAnual)}
                    </span>
                    <span className="preco-periodo">
                      / {periodo === 'mensal' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  
                  {periodo === 'anual' && (
                    <div className="preco-economia">
                      Economize {formatarPreco((plano.precoMensal * 12) - plano.precoAnual)}
                    </div>
                  )}
                  
                  <div className="plano-recursos">
                    <ul>
                      {plano.recursos.map((recurso, idx) => (
                        <li key={idx}>
                          <img src={iconeCheck} alt="✓" className="check-icon" />
                          {recurso}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    className="plano-btn"
                    onClick={() => handleContratar(plano.id)}
                  >
                    Contratar {plano.nome}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2>Ainda tem dúvidas sobre qual plano escolher?</h2>
            <p>Entre em contato conosco e teremos prazer em ajudar você a escolher o melhor plano para sua fazenda</p>
            <button className="cta-button" onClick={() => navigate('/contato')}>
              Fale com um especialista
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Planos;