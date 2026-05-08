import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import homeIcon from '../assets/icons/home.png';
import animaisIcon from '../assets/icons/animais.png';
import lotesIcon from '../assets/icons/lotes.png';
import vacinasIcon from '../assets/icons/vacinas.png';
import reproducaoIcon from '../assets/icons/repro.png';
import pesagensIcon from '../assets/icons/pesagem.png';
import estoqueIcon from '../assets/icons/estoque.png';
import relatoriosIcon from '../assets/icons/relatorio.png';
import dietasIcon from '../assets/icons/dietas.png';
import funcionariosIcon from '../assets/icons/funcionarios.png';
import configuracoesIcon from '../assets/icons/config.png';
import logoutIcon from '../assets/icons/sair.png';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [permissoes, setPermissoes] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(currentUser);
    setPermissoes(currentUser.permissoes);
  }, []);

  const menuItems = [
    { name: 'HOME', path: '/dashboard', module: 'animais', icon: homeIcon, alt: 'Home' },
    { name: 'ANIMAIS', path: '/animais', module: 'animais', icon: animaisIcon, alt: 'Animais' },
    { name: 'LOTES', path: '/lotes', module: 'lotes', icon: lotesIcon, alt: 'Lotes' },
    { name: 'VACINAS', path: '/vacinas', module: 'vacinas', icon: vacinasIcon, alt: 'Vacinas' },
    { name: 'REPRODUÇÃO', path: '/reproducao', module: 'reproducao', icon: reproducaoIcon, alt: 'Reprodução' },
    { name: 'PESAGENS', path: '/pesagens', module: 'pesagens', icon: pesagensIcon, alt: 'Pesagens' },
    { name: 'ESTOQUE', path: '/estoque', module: 'estoque', icon: estoqueIcon, alt: 'Estoque' },
    { name: 'RELATÓRIOS', path: '/relatorios', module: 'relatorios', icon: relatoriosIcon, alt: 'Relatórios' },
    { name: 'DIETAS', path: '/dietas', module: 'dietas', icon: dietasIcon, alt: 'Dietas' },
    { name: 'FUNCIONÁRIOS', path: '/funcionarios', module: 'funcionarios', icon: funcionariosIcon, alt: 'Funcionários' },
    { name: 'CONFIGURAÇÕES', path: '/configuracoes', module: 'configuracoes', icon: configuracoesIcon, alt: 'Configurações' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const visibleMenuItems = menuItems.filter(item => {
    if (!permissoes) return true;
    if (user?.tipo === 'admin') return true;
    return permissoes[item.module]?.ver === true;
  });

  if (!user) {
    return <div className="sidebar-loading">Carregando...</div>;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>BULLTECH</h1>
        {user.tipo === 'funcionario' && (
          <div className="user-badge">👨‍💼 {user.cargoLabel || user.cargo}</div>
        )}
      </div>
      <ul className="sidebar-menu">
        {visibleMenuItems.map((item) => (
          <li 
            key={item.path}
            className={isActive(item.path) ? 'active' : ''}
            onClick={() => navigate(item.path)}
          >
            <img src={item.icon} alt={item.alt} className="menu-icon-img" />
            <span className="menu-name">{item.name}</span>
          </li>
        ))}
        <li className="logout" onClick={handleLogout}>
          <img src={logoutIcon} alt="Sair" className="menu-icon-img" />
          <span className="menu-name">SAIR</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;