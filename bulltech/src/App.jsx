import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Contato from './pages/Contato';
import SobreNos from './pages/Sobrenos';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Animais from './pages/Animais';
import Lotes from './pages/Lotes';
import Vacinas from './pages/Vacinas';
import Reproducao from './pages/Reproducao';
import Pesagens from './pages/Pesagens';
import Estoque from './pages/Estoque';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import Dietas from './pages/Dietas';
import Funcionarios from './pages/Funcionarios';
import NovoAnimal from './pages/Animais/NovoAnimal';
import EditarAnimal from './pages/Animais/EditarAnimal';
import VisualizarAnimal from './pages/Animais/VisualizarAnimal';
import NovoLote from './pages/Lotes/NovoLote';
import EditarLote from './pages/Lotes/EditarLote';
import VisualizarLote from './pages/Lotes/VisualizarLote';
import NovaVacina from './pages/Vacinas/NovaVacina';
import EditarVacina from './pages/Vacinas/EditarVacina';
import VisualizarVacina from './pages/Vacinas/VisualizarVacina';
import AplicarVacina from './pages/Vacinas/AplicarVacina';
import NovoRegistroReproducao from './pages/Reproducao/NovoRegistroReproducao';
import EditarReproducao from './pages/Reproducao/EditarReproducao';
import VisualizarReproducao from './pages/Reproducao/VisualizarReproducao';
import NovaPesagem from './pages/Pesagens/NovaPesagem';
import EditarPesagem from './pages/Pesagens/EditarPesagem';
import VisualizarPesagem from './pages/Pesagens/VisualizarPesagem';
import NovoProduto from './pages/Estoque/NovoProduto';
import EditarProduto from './pages/Estoque/EditarProduto';
import VisualizarProduto from './pages/Estoque/VisualizarProduto';
import NovaDieta from './pages/Dietas/NovaDieta';
import EditarDieta from './pages/Dietas/EditarDieta';
import VisualizarDieta from './pages/Dietas/VisualizarDieta';
import NovoFuncionario from './pages/Funcionarios/NovoFuncionario';
import EditarFuncionario from './pages/Funcionarios/EditarFuncionario';
import VisualizarFuncionario from './pages/Funcionarios/VisualizarFuncionario';
import EsqueciSenha from './pages/EsqueciSenha';
import Plano from './pages/Planos';
import TesteConexao from './pages/TesteConexao';
import LoginFuncionario from './pages/LoginFuncionario';
import DashboardFuncionario from './pages/DashboardFuncionario';
import AdminDashboard from './pages/Admin/AdminDashboard';


function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/sobre" element={<SobreNos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/plano" element={<Plano />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/teste" element={<TesteConexao />} />
        <Route path="/login-funcionario" element={<LoginFuncionario />} />
        <Route path="/dashboard-funcionario" element={<DashboardFuncionario />} />


        {/* Rotas de admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        
        {/* Rotas do dashboard com layout compartilhado */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          
          {/* Rotas de Animais */}
          <Route path="/animais" element={<Animais />} />
          <Route path="/animais/novo" element={<NovoAnimal />} />
          <Route path="/animais/editar/:id" element={<EditarAnimal />} />
          <Route path="/animais/visualizar/:id" element={<VisualizarAnimal />} />
          
          {/* Rotas de Lotes */}
          <Route path="/lotes" element={<Lotes />} />
          <Route path="/lotes/novo" element={<NovoLote />} />
          <Route path="/lotes/editar/:id" element={<EditarLote />} />
          <Route path="/lotes/visualizar/:id" element={<VisualizarLote />} />

          {/* Rotas de Vacinas */}
          <Route path="/vacinas" element={<Vacinas />} />
          <Route path="/vacinas/novo" element={<NovaVacina />} />
          <Route path="/vacinas/editar/:id" element={<EditarVacina />} />
          <Route path="/vacinas/visualizar/:id" element={<VisualizarVacina />} />
          <Route path="/vacinas/aplicar" element={<AplicarVacina />} />

          {/* Rotas de Reprodução */}
          <Route path="/reproducao" element={<Reproducao />} />
          <Route path="/reproducao/novo" element={<NovoRegistroReproducao />} />
          <Route path="/reproducao/editar/:id" element={<EditarReproducao />} />
          <Route path="/reproducao/visualizar/:id" element={<VisualizarReproducao />} />

          // Dentro do Routes, adicione:
          <Route path="/pesagens" element={<Pesagens />} />
          <Route path="/pesagens/novo" element={<NovaPesagem />} />
          <Route path="/pesagens/editar/:id" element={<EditarPesagem />} />
          <Route path="/pesagens/visualizar/:id" element={<VisualizarPesagem />} />

          // Dentro do Routes, adicione:
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/estoque/novo" element={<NovoProduto />} />
          <Route path="/estoque/editar/:id" element={<EditarProduto />} />
          <Route path="/estoque/visualizar/:id" element={<VisualizarProduto />} />

          // Dentro do Routes, adicione:
          <Route path="/dietas" element={<Dietas />} />
          <Route path="/dietas/novo" element={<NovaDieta />} />
          <Route path="/dietas/editar/:id" element={<EditarDieta />} />
          <Route path="/dietas/visualizar/:id" element={<VisualizarDieta />} />

          // Dentro do Routes, adicione:
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/funcionarios/novo" element={<NovoFuncionario />} />
          <Route path="/funcionarios/editar/:id" element={<EditarFuncionario />} />
          <Route path="/funcionarios/visualizar/:id" element={<VisualizarFuncionario />} />
          
          {/* Outras rotas */}
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;