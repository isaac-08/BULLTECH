import React, { useState } from 'react';
import './ChatWhatsApp.css';

const ChatWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  // Número do suporte (substitua pelo seu número)
  const numeroWhatsApp = '5511999999999'; // Formato: 55 + DDD + número

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const texto = `*NOVO CONTATO - BULLTECH*\n\n*Nome:* ${nome || 'Não informado'}\n*Email:* ${email || 'Não informado'}\n\n*Mensagem:* ${message}`;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setMessage('');
    setNome('');
    setEmail('');
  };

  return (
    <>
      <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
        <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
          <span className="chat-icon">💬</span>
          <span className="chat-title">Fale Conosco</span>
          <span className="chat-close">{isOpen ? '✕' : ''}</span>
        </div>
        
        {isOpen && (
          <div className="chat-body">
            <div className="chat-messages">
              <div className="chat-welcome">
                <p>Olá! 👋</p>
                <p>Como podemos ajudar você hoje?</p>
                <p>Deixe sua mensagem e entraremos em contato.</p>
              </div>
            </div>
            
            <div className="chat-input-area">
              <input 
                type="text" 
                placeholder="Seu nome" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="chat-input-name"
              />
              <input 
                type="email" 
                placeholder="Seu email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="chat-input-email"
              />
              <textarea 
                placeholder="Digite sua mensagem..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="chat-input-message"
                rows="3"
              />
              <button onClick={handleSendMessage} className="chat-send-btn">
                Enviar via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWhatsApp;