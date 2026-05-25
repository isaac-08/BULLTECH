import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

// Importando os ícones da sidebar
import homeIcon from '../../assets/icons/home.png';
import animaisIcon from '../../assets/icons/animais.png';
import lotesIcon from '../../assets/icons/lotes.png';
import vacinasIcon from '../../assets/icons/vacinas.png';
import usuariosIcon from '../../assets/icons/usuario.png';
import relatoriosIcon from '../../assets/icons/relatorio.png';
import configuracoesIcon from '../../assets/icons/config.png';
import estoqueIcon from '../../assets/icons/estoque.png';
import funcionariosIcon from '../../assets/icons/funcionarios.png';
import dietasIcon from '../../assets/icons/dietas.png';
import pesagemIcon from '../../assets/icons/pesagem.png';
import reproducaoIcon from '../../assets/icons/repro.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [detalhesFazendas, setDetalhesFazendas] = useState([]);
  
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalFazendas: 0,
    totalAnimais: 0,
    totalLotes: 0,
    totalVacinas: 0,
    totalPesagens: 0,
    totalFuncionarios: 0,
    totalEstoque: 0,
    totalDietas: 0,
    totalReproducoes: 0
  });

  useEffect(() => {
    const inicializar = async () => {
      const autorizado = await verificarAdmin();
      if (autorizado) {
        await carregarDados();
      }
    };
    inicializar();
  }, []);

  const verificarAdmin = async () => {
    // 1. Verificação rápida local
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email === 'admin@gmail.com' && currentUser.isAdmin === true) {
      return true;
    }

    // 2. Verificação no Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return false;
    }

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('tipo')
      .eq('auth_id', user.id)
      .single();

    if (perfil?.tipo !== 'admin') {
      alert('Acesso restrito a administradores!');
      navigate('/dashboard');
      return false;
    }

    return true;
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Chamada única à View otimizada que criamos no Postgres
      const { data: viewData, error } = await supabase
        .from('v_detalhes_fazendas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const dadosFormatados = viewData || [];
      setDetalhesFazendas(dadosFormatados);

      // Calcula os totais agregados usando reduce (operação em memória ultra rápida)
      const agregados = dadosFormatados.reduce((acc, curr) => {
        acc.totalAnimais += Number(curr.total_animais || 0);
        acc.totalLotes += Number(curr.total_lotes || 0);
        acc.totalVacinas += Number(curr.total_vacinas || 0);
        acc.totalPesagens += Number(curr.total_pesagens || 0);
        acc.totalFuncionarios += Number(curr.total_funcionarios || 0);
        acc.totalEstoque += Number(curr.total_estoque || 0);
        acc.totalDietas += Number(curr.total_dietas || 0);
        acc.totalReproducoes += Number(curr.total_reproducoes || 0);
        return acc;
      }, {
        totalAnimais: 0, totalLotes: 0, totalVacinas: 0, totalPesagens: 0,
        totalFuncionarios: 0, totalEstoque: 0, totalDietas: 0, totalReproducoes: 0
      });

      setStats({
        totalUsuarios: dadosFormatados.length,
        totalFazendas: dadosFormatados.length,
        ...agregados
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados do painel.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: homeIcon },
    { id: 'fazendas', label: 'Fazendas', icon: usuariosIcon },
    { id: 'animais', label: 'Animais', icon: animaisIcon },
    { id: 'estoque', label: 'Estoque', icon: estoqueIcon },
    { id: 'funcionarios', label: 'Funcionários', icon: funcionariosIcon },
    { id: 'dietas', label: 'Dietas', icon: dietasIcon },
    { id: 'relatorios', label: 'Relatórios', icon: relatoriosIcon }
  ];

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Painel Administrativo</h2>
          <p>Carregando dados do sistema...</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="welcome-section">
        <h2>
          <img src={homeIcon} alt="Admin" className="icon icon-md" style={{ marginRight: '10px' }} />
          Painel Administrativo
        </h2>
        <p>Visão geral de todas as fazendas do sistema BULLTECH</p>
      </div>

      <div className="page-content">
        <div className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <img src={tab.icon} alt={tab.label} className="icon icon-sm" style={{ marginRight: '8px' }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard - Cards Gerais */}
        {activeTab === 'dashboard' && (
          <>
            <div className="stats-grid-admin">
              <div className="stat-card-admin">
                <div className="stat-icon"><img src={usuariosIcon} alt="Fazendas" className="icon icon-md" /></div>
                <div className="stat-info">
                  <h3>Fazendas</h3>
                  <div className="stat-number">{stats.totalFazendas}</div>
                  <span>Cadastradas no sistema</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon"><img src={animaisIcon} alt="Animais" className="icon icon-md" /></div>
                <div className="stat-info">
                  <h3>Animais</h3>
                  <div className="stat-number">{stats.totalAnimais}</div>
                  <span>Total em todas as fazendas</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon"><img src={lotesIcon} alt="Lotes" className="icon icon-md" /></div>
                <div className="stat-info">
                  <h3>Lotes</h3>
                  <div className="stat-number">{stats.totalLotes}</div>
                  <span>Lotes cadastrados</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon"><img src={vacinasIcon} alt="Vacinas" className="icon icon-md" /></div>
                <div className="stat-info">
                  <h3>Vacinas</h3>
                  <div className="stat-number">{stats.totalVacinas}</div>
                  <span>Doses aplicadas</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon"><img src={pesagemIcon} alt="Pesagens" className="icon icon-md" /></div>
                <div className="stat-info">
                  <h3>Pesagens</h3>
                  <div className="stat-number">{stats.totalPesagens}</div>
                  <span>Registros de peso</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon"><img src={funcionariosIcon} alt="Funcionários" className="icon icon-md" /></div>
                <div className="stat-info">
                  <h3>Funcionários</h3>
                  <div className="stat-number">{stats.totalFuncionarios}</div>
                  <span>Em todas as fazendas</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon"><img src={estoqueIcon} alt="Estoque" className="icon icon-md" /></div>
                <div className="stat-info">
                  <h3>Estoque</h3>
                  <div className="stat-number">{stats.totalEstoque}</div>
                  <span>Itens em estoque</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon"><img src={dietasIcon} alt="Dietas" className="icon icon-md" /></div>
                <div className="stat-info">
                  <h3>Dietas</h3>
                  <div className="stat-number">{stats.totalDietas}</div>
                  <span>Dietas cadastradas</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon"><img src={reproducaoIcon} alt="Reproduções" className="icon icon-md" /></div>
                <div className="stat-info">
                  <h3>Reproduções</h3>
                  <div className="stat-number">{stats.totalReproducoes}</div>
                  <span>Eventos registrados</span>
                </div>
              </div>
            </div>

            <div className="admin-charts">
              <div className="chart-card">
                <h3>Distribuição de Planos</h3>
                <div className="plano-distribuicao">
                  {(() => {
                    const total = detalhesFazendas.length;
                    const basico = detalhesFazendas.filter(u => (u.plano || 'basico') === 'basico').length;
                    const profissional = detalhesFazendas.filter(u => u.plano === 'profissional').length;
                    const empresarial = detalhesFazendas.filter(u => u.plano === 'empresarial').length;
                    
                    return (
                      <>
                        <div className="plano-bar">
                          <span>Básico</span>
                          <div className="bar-container">
                            <div className="bar" style={{ width: total > 0 ? `${(basico / total) * 100}%` : '0%' }}>
                              {total > 0 ? Math.round((basico / total) * 100) : 0}%
                            </div>
                          </div>
                          <span className="bar-count">{basico} fazendas</span>
                        </div>
                        <div className="plano-bar">
                          <span>Profissional</span>
                          <div className="bar-container">
                            <div className="bar" style={{ width: total > 0 ? `${(profissional / total) * 100}%` : '0%' }}>
                              {total > 0 ? Math.round((profissional / total) * 100) : 0}%
                            </div>
                          </div>
                          <span className="bar-count">{profissional} fazendas</span>
                        </div>
                        <div className="plano-bar">
                          <span>Empresarial</span>
                          <div className="bar-container">
                            <div className="bar" style={{ width: total > 0 ? `${(empresarial / total) * 100}%` : '0%' }}>
                              {total > 0 ? Math.round((empresarial / total) * 100) : 0}%
                            </div>
                          </div>
                          <span className="bar-count">{empresarial} fazendas</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Fazendas - Lista detalhada de cada fazenda */}
        {activeTab === 'fazendas' && (
          <div className="admin-table-container">
            <h3>Todas as Fazendas Cadastradas</h3>
            <div className="admin-stats-bar">
              <span>Total: <strong>{detalhesFazendas.length}</strong> fazendas</span>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fazenda</th>
                    <th>Responsável</th>
                    <th>Plano</th>
                    <th>Animais</th>
                    <th>Lotes</th>
                    <th>Funcionários</th>
                    <th>Estoque</th>
                    <th>Vacinas</th>
                    <th>Dietas</th>
                    <th>Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhesFazendas.map(fazenda => (
                    <tr key={fazenda.id}>
                      <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                      <td>{fazenda.nome}</td>
                      <td className="actions-cell">
                        <span className={`plano-badge ${fazenda.plano === 'profissional' ? 'profissional' : fazenda.plano === 'empresarial' ? 'empresarial' : 'basico'}`}>
                          {fazenda.plano || 'Básico'}
                        </span>
                      </td>
                      <td>{fazenda.total_animais}</td>
                      <td>{fazenda.total_lotes}</td>
                      <td>{fazenda.total_funcionarios}</td>
                      <td>{fazenda.total_estoque}</td>
                      <td>{fazenda.total_vacinas}</td>
                      <td>{fazenda.total_dietas}</td>
                      <td>{fazenda.created_at ? new Date(fazenda.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                    </tr>
                  ))}
                  {detalhesFazendas.length === 0 && (
                    <tr>
                      <td colSpan="10" className="empty-message">Nenhuma fazenda cadastrada</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Animais - Totais por fazenda */}
        {activeTab === 'animais' && (
          <div className="admin-table-container">
            <h3>Distribuição de Animais por Fazenda</h3>
            <div className="admin-stats-bar">
              <span>Total Geral: <strong>{stats.totalAnimais}</strong> animais</span>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fazenda</th>
                    <th>Total Animais</th>
                    <th>Machos</th>
                    <th>Fêmeas</th>
                    <th>% do Sistema</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhesFazendas.map(fazenda => (
                    <tr key={fazenda.id}>
                      <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                      <td>{fazenda.total_animais}</td>
                      <td>{fazenda.total_machos || 0}</td>
                      <td>{fazenda.total_femeas || 0}</td>
                      <td>
                        <div className="percent-bar">
                          <div className="percent-fill" style={{ width: `${stats.totalAnimais > 0 ? (fazenda.total_animais / stats.totalAnimais) * 100 : 0}%` }}></div>
                          <span>{stats.totalAnimais > 0 ? Math.round((fazenda.total_animais / stats.totalAnimais) * 100) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {detalhesFazendas.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-message">Nenhum animal cadastrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Estoque - Totais por fazenda */}
        {activeTab === 'estoque' && (
          <div className="admin-table-container">
            <h3>Distribuição de Estoque por Fazenda</h3>
            <div className="admin-stats-bar">
              <span>Total Geral: <strong>{stats.totalEstoque}</strong> itens</span>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fazenda</th>
                    <th>Itens em Estoque</th>
                    <th>% do Sistema</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhesFazendas.map(fazenda => (
                    <tr key={fazenda.id}>
                      <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                      <td>{fazenda.total_estoque}</td>
                      <td>
                        <div className="percent-bar">
                          <div className="percent-fill" style={{ width: `${stats.totalEstoque > 0 ? (fazenda.total_estoque / stats.totalEstoque) * 100 : 0}%` }}></div>
                          <span>{stats.totalEstoque > 0 ? Math.round((fazenda.total_estoque / stats.totalEstoque) * 100) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {detalhesFazendas.length === 0 && (
                    <tr>
                      <td colSpan="3" className="empty-message">Nenhum item em estoque</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Funcionários - Totais por fazenda */}
        {activeTab === 'funcionarios' && (
          <div className="admin-table-container">
            <h3>Distribuição de Funcionários por Fazenda</h3>
            <div className="admin-stats-bar">
              <span>Total Geral: <strong>{stats.totalFuncionarios}</strong> funcionários</span>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fazenda</th>
                    <th>Funcionários</th>
                    <th>% do Sistema</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhesFazendas.map(fazenda => (
                    <tr key={fazenda.id}>
                      <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                      <td>{fazenda.total_funcionarios}</td>
                      <td>
                        <div className="percent-bar">
                          <div className="percent-fill" style={{ width: `${stats.totalFuncionarios > 0 ? (fazenda.total_funcionarios / stats.totalFuncionarios) * 100 : 0}%` }}></div>
                          <span>{stats.totalFuncionarios > 0 ? Math.round((fazenda.total_funcionarios / stats.totalFuncionarios) * 100) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {detalhesFazendas.length === 0 && (
                    <tr>
                      <td colSpan="3" className="empty-message">Nenhum funcionário cadastrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dietas - Totais por fazenda */}
        {activeTab === 'dietas' && (
          <div className="admin-table-container">
            <h3>Distribuição de Dietas por Fazenda</h3>
            <div className="admin-stats-bar">
              <span>Total Geral: <strong>{stats.totalDietas}</strong> dietas</span>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fazenda</th>
                    <th>Dietas</th>
                    <th>% do Sistema</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhesFazendas.map(fazenda => (
                    <tr key={fazenda.id}>
                      <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                      <td>{fazenda.total_dietas}</td>
                      <td>
                        <div className="percent-bar">
                          <div className="percent-fill" style={{ width: `${stats.totalDietas > 0 ? (fazenda.total_dietas / stats.totalDietas) * 100 : 0}%` }}></div>
                          <span>{stats.totalDietas > 0 ? Math.round((fazenda.total_dietas / stats.totalDietas) * 100) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {detalhesFazendas.length === 0 && (
                    <tr>
                      <td colSpan="3" className="empty-message">Nenhuma dieta cadastrada</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Relatórios */}
        {activeTab === 'relatorios' && (
          <div className="admin-relatorios">
            <h3>Relatórios Gerenciais</h3>
            <div className="relatorios-grid">
              <div className="relatorio-card" onClick={() => alert('Relatório geral gerado!')}>
                <div className="relatorio-icon">
                  <img src={relatoriosIcon} alt="Relatório" className="icon icon-md" />
                </div>
                <h4>Relatório Geral</h4>
                <p>Visão completa de todas as fazendas</p>
              </div>
              <div className="relatorio-card" onClick={() => alert('Exportando dados...')}>
                <div className="relatorio-icon">📥</div>
                <h4>Exportar CSV</h4>
                <p>Exportar dados de todas as fazendas</p>
              </div>
              <div className="relatorio-card" onClick={() => alert('Função em desenvolvimento')}>
                <div className="relatorio-icon">📈</div>
                <h4>Gráficos</h4>
                <p>Visualizar dados em gráficos</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;