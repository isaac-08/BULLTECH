import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import iconsIndex from '../assets/icons/index';
import banner from '../assets/banner_home.jpg';
import fazendeiro from '../assets/icons/fazendeiro.jpg';
import veterinario from '../assets/icons/veterinario.jpg';
import adm from '../assets/icons/adm.jpg';
import './Home.css';

const Index = () => {
  const navigate = useNavigate();

  const funcionalidades = [
    { icone: iconsIndex.animais, titulo: "Gestão de Rebanho", descricao: "Controle total de todos os animais da sua fazenda" },
    { icone: iconsIndex.grafico, titulo: "Visualização Inteligente", descricao: "Dashboards e gráficos para melhor tomada de decisão" },
    { icone: iconsIndex.ranking, titulo: "Monitoria e Análise", descricao: "Acompanhamento detalhado do desempenho do rebanho" },
    { icone: iconsIndex.seguranca, titulo: "Gestão Inicial Privada", descricao: "Segurança e privacidade dos seus dados" }
  ];

  const depoimentos = [
    {
      nome: "João Silva",
      cargo: "Produtor Rural",
      texto: "Vai contar com Bulltech no Brasil. Aqui você pode encontrar informações sobre os produtos e serviços que oferecemos.",
      imagem: fazendeiro
    },
    {
      nome: "Maria Santos",
      cargo: "Administradora",
      texto: "Para mais informações, contacte-nos. A plataforma revolucionou minha fazenda!",
      imagem: adm
    },
    {
      nome: "Carlos Oliveira",
      cargo: "Veterinário",
      texto: "Produtos e serviços exclusivos que facilitam o dia a dia na propriedade.",
      imagem: veterinario
    }
  ];

  return (
    <div className="index-page">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <img src={banner} alt="Banner BULLTECH" className="hero-banner" />
        </section>

        {/* O que a BULLTECH faz por você? */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">O que a BULLTECH faz por você?</h2>
            <div className="features-grid">
              {funcionalidades.map((func, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <img src={func.icone} alt={func.titulo} className="feature-icon-img" />
                  </div>
                  <h3>{func.titulo}</h3>
                  <p>{func.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="cta-banner">
          <div className="container">
            <div className="cta-content">
              <h2>Tenha o controle da sua fazenda em um único lugar!</h2>
              <p>Simples, Rápido e Poderoso</p>
              <button className="cta-button" onClick={() => navigate('/cadastro')}>
                Começar Agora
              </button>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="testimonials-section">
          <div className="container">
            <h2 className="section-title">Testemunhos de quem confia na BULLTECH</h2>
            <div className="testimonials-grid">
              {depoimentos.map((dep, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-avatar">
                    <img src={dep.imagem} alt={dep.nome} className="testimonial-avatar-img" />
                  </div>
                  <p className="testimonial-text">"{dep.texto}"</p>
                  <div className="testimonial-author">
                    <strong>{dep.nome}</strong>
                    <span>{dep.cargo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;