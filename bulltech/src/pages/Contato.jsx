import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import banner from '../assets/banner_contato.jpg';
import iconsContato from '../assets/icons/contato';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      console.log('Mensagem enviada:', formData);
      setEnviado(true);
      setLoading(false);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
      
      setTimeout(() => setEnviado(false), 5000);
    }, 1000);
  };

  const assuntos = [
    'Dúvidas sobre o sistema',
    'Suporte técnico',
    'Sugestões',
    'Problemas com acesso',
    'Orçamento',
    'Parcerias',
    'Outros'
  ];

  const contatosInfo = [
    { icone: iconsContato.email, titulo: "Email", descricao: "contato@bulltech.com.br", link: "mailto:contato@bulltech.com.br" },
    { icone: iconsContato.telefone, titulo: "Telefone", descricao: "(11) 4000-0000", link: "tel:1140000000" },
    { icone: iconsContato.whatsapp, titulo: "WhatsApp", descricao: "(11) 98888-8888", link: "https://wa.me/5511988888888" },
    { icone: iconsContato.local, titulo: "Endereço", descricao: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP", link: null },
    { icone: iconsContato.relogio, titulo: "Horário", descricao: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h", link: null }
  ];

  const primeiraLinha = contatosInfo.slice(0, 3);
  const segundaLinha = contatosInfo.slice(3, 5);

  return (
    <div className="contato-page">
      <Navbar />
      
      <main>
        {/* Hero Section */}
                <section className="hero-section">
                  <img src={banner} alt="Banner BULLTECH" className="hero-banner" />
                </section>

        <section className="info-card-section">
          <div className="container">
            <div className="info-card-unico">
              <div className="info-row">
                {primeiraLinha.map((item, index) => (
                  <div key={index} className="info-item">
                    <div className="info-icon">
                      <img src={item.icone} alt={item.titulo} className="info-icon-img" />
                    </div>
                    <div className="info-details">
                      <h3>{item.titulo}</h3>
                      {item.link ? (
                        <a href={item.link}>{item.descricao}</a>
                      ) : (
                        <p>{item.descricao}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="info-row">
                {segundaLinha.map((item, index) => (
                  <div key={index} className="info-item">
                    <div className="info-icon">
                      <img src={item.icone} alt={item.titulo} className="info-icon-img" />
                    </div>
                    <div className="info-details">
                      <h3>{item.titulo}</h3>
                      {item.link ? (
                        <a href={item.link}>{item.descricao}</a>
                      ) : (
                        <p>{item.descricao}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="container">
            <div className="form-wrapper">
              <div className="form-info">
                <h2>Envie uma mensagem</h2>
                <p>Preencha o formulário abaixo e entraremos em contato o mais breve possível.</p>
                <div className="form-contact-list">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <img src={iconsContato.telefone} alt="Telefone" className="contact-icon-img" />
                    </div>
                    <div>
                      <strong>Suporte 24h</strong>
                      <p>Emergências: (11) 99999-9999</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <img src={iconsContato.whatsapp} alt="WhatsApp" className="contact-icon-img" />
                    </div>
                    <div>
                      <strong>Chat Online</strong>
                      <p>Segunda a Sexta, 8h às 18h</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <form className="contato-form" onSubmit={handleSubmit}>
                {enviado && (
                  <div className="success-message">
                    ✅ Mensagem enviada com sucesso!
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome completo *</label>
                    <input 
                      type="text" 
                      name="nome" 
                      value={formData.nome}
                      onChange={handleChange}
                      required 
                      placeholder="Digite seu nome"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone</label>
                    <input 
                      type="tel" 
                      name="telefone" 
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Assunto *</label>
                    <select 
                      name="assunto" 
                      value={formData.assunto}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um assunto</option>
                      {assuntos.map(assunto => (
                        <option key={assunto} value={assunto}>{assunto}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Mensagem *</label>
                  <textarea 
                    name="mensagem" 
                    value={formData.mensagem}
                    onChange={handleChange}
                    required 
                    rows="5"
                    placeholder="Descreva sua mensagem detalhadamente..."
                  ></textarea>
                </div>
                
                <button type="submit" className="btn-enviar" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contato;