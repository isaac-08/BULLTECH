import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bannerPlanos from '../assets/banner_planos.png';

// Ícones (você pode substituir pelos seus ícones)
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
      limites: {
        maxAnimais: 100,
        maxLotes: 5,
        maxFuncionarios: 3,
        maxVacinas: 50,
        maxPesagens: 200,
        maxEstoque: 30,
        maxDietas: 10,
        maxReproducoes: 50
      },
      recursos: [
        'Até 100 animais',
        'Até 5 lotes',
        'Até 3 funcionários',
        'Relatórios básicos',
        'Suporte por email'
      ]
    },
    PROFISSIONAL: {
      id: 'profissional',
      nome: 'Plano Profissional',
      precoMensal: 199.90,
      precoAnual: 1999.00,
      icone: iconeProfissional,
      limites: {
        maxAnimais: 400,
        maxLotes: 15,
        maxFuncionarios: 10,
        maxVacinas: 200,
        maxPesagens: 1000,
        maxEstoque: 100,
        maxDietas: 50,
        maxReproducoes: 200
      },
      recursos: [
        'Até 400 animais',
        'Até 15 lotes',
        'Até 10 funcionários',
        'Relatórios básicos',
        'Relatórios avançados',
        'Suporte por email',
        'Suporte WhatsApp'
      ]
    },
    EMPRESARIAL: {
      id: 'empresarial',
      nome: 'Plano Empresarial',
      precoMensal: 399.90,
      precoAnual: 3999.00,
      icone: iconeEmpresarial,
      limites: {
        maxAnimais: 2000,
        maxLotes: 100,
        maxFuncionarios: 50,
        maxVacinas: 1000,
        maxPesagens: 10000,
        maxEstoque: 500,
        maxDietas: 200,
        maxReproducoes: 1000
      },
      recursos: [
        'Até 2000 animais',
        'Até 100 lotes',
        'Até 50 funcionários',
        'Relatórios básicos',
        'Relatórios avançados',
        'Relatórios personalizados',
        'Suporte prioritário',
        'API de acesso'
      ]
    }
  };

  const handleContratar = (planoId) => {
    setPlanoSelecionado(planoId);
    // Salvar plano selecionado no localStorage para o processo de checkout
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
                  
                  <div className="plano-limites">
                    <h4>Limites do plano:</h4>
                    <ul>
                      <li>✓ {plano.limites.maxAnimais} animais</li>
                      <li>✓ {plano.limites.maxLotes} lotes</li>
                      <li>✓ {plano.limites.maxFuncionarios} funcionários</li>
                      <li>✓ {plano.limites.maxVacinas} vacinas</li>
                      <li>✓ {plano.limites.maxPesagens} pesagens</li>
                    </ul>
                  </div>
                  
                  <div className="plano-recursos">
                    <h4>Recursos incluídos:</h4>
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