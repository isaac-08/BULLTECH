import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Foot.css';
import icons from '../assets/icons/index-all';

const Foot = () => {
  const navigate = useNavigate();
  const anoAtual = new Date().getFullYear();

  // Pegando os ícones do footer
  const footerIcons = icons.footer || {};
  const { 
    whatsapp, 
    email, 
    telefone, 
    local, 
    animais, 
    grafico, 
    vacinas, 
    pesagem,
    home,
    plano,
    seguranca,
    cadastro
  } = footerIcons;

  // Função para renderizar ícone com fallback para emoji
  const renderIcon = (icon, alt, emoji) => {
    if (icon) {
      return <img src={icon} alt={alt} className="footer-icon" />;
    }
    return <span className="footer-emoji">{emoji}</span>;
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Coluna 1 - Logo e Sobre */}
          <div className="footer-col">
            <h3 className="footer-logo">🐂 BULLTECH</h3>
            <p className="footer-description">
              Soluções inteligentes para gestão pecuária. 
              Tenha o controle total da sua fazenda em um único lugar.
            </p>
          </div>

          {/* Coluna 2 - Links Rápidos com ícones */}
          <div className="footer-col">
            <h4 className="footer-title">Links Rápidos</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => navigate('/')} className="footer-link-btn">
                  {renderIcon(home, "Início", "🏠")}
                  <span>Início</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/planos')} className="footer-link-btn">
                  {renderIcon(plano, "Planos", "⭐")}
                  <span>Planos</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="footer-link-btn">
                  {renderIcon(seguranca, "Login", "🔐")}
                  <span>Login</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cadastro')} className="footer-link-btn">
                  {renderIcon(cadastro, "Cadastro", "📝")}
                  <span>Cadastro</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Funcionalidades com ícones */}
          <div className="footer-col">
            <h4 className="footer-title">Funcionalidades</h4>
            <ul className="footer-links">
              <li>
                {renderIcon(animais, "Animais", "🐄")}
                <span>Gestão de Rebanho</span>
              </li>
              <li>
                {renderIcon(grafico, "Gráfico", "📊")}
                <span>Dashboards Inteligentes</span>
              </li>
              <li>
                {renderIcon(vacinas, "Vacinas", "💉")}
                <span>Controle de Vacinas</span>
              </li>
              <li>
                {renderIcon(pesagem, "Pesagem", "⚖️")}
                <span>Pesagens e Ganho de Peso</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato com ícones */}
          <div className="footer-col">
            <h4 className="footer-title">Contato</h4>
            <ul className="footer-contato">
              <li>
                {renderIcon(email, "Email", "📧")}
                <span>contato@bulltech.com</span>
              </li>
              <li>
                {renderIcon(telefone, "Telefone", "📞")}
                <span>(11) 99999-9999</span>
              </li>
              <li>
                {renderIcon(whatsapp, "WhatsApp", "💬")}
                <span>(11) 98888-7777</span>
              </li>
              <li>
                {renderIcon(local, "Local", "📍")}
                <span>SENAI - São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="footer-divider"></div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© {anoAtual} BULLTECH. Todos os direitos reservados.</p>
          <p>SENAI | Projeto Integrador de Desenvolvimento de Sistemas</p>
        </div>
      </div>
    </footer>
  );
};

export default Foot;