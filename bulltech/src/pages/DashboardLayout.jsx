import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFuncionario, setIsFuncionario] = useState(false);

  useEffect(() => {
    // Verificar se é administrador
    const currentUser = localStorage.getItem('currentUser');
    // Verificar se é funcionário
    const funcionarioLogado = localStorage.getItem('funcionarioLogado');
    
    if (currentUser) {
      setUser(JSON.parse(currentUser));
      setIsFuncionario(false);
    } else if (funcionarioLogado) {
      const func = JSON.parse(funcionarioLogado);
      setUser({
        id: func.id,
        nome: func.nome,
        fazenda: 'Fazenda',
        isFuncionario: true,
        nivelAcesso: func.nivelAcesso
      });
      setIsFuncionario(true);
    } else {
      navigate('/login');
      return;
    }
  }, [navigate]);

  if (!user) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Header userName={user.nome} userTitle={isFuncionario ? `Funcionário - ${user.nivelAcesso || 'Visualizador'}` : "Msc. Veterinário"} />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;