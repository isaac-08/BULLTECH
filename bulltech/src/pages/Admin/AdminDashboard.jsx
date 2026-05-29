import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import homeIcon from '../../assets/icons/home.png';
import animaisIcon from '../../assets/icons/animais.png';
import lotesIcon from '../../assets/icons/lotes.png';
import vacinasIcon from '../../assets/icons/vacinas.png';
import usuariosIcon from '../../assets/icons/usuario.png';
import relatoriosIcon from '../../assets/icons/relatorio.png';
import estoqueIcon from '../../assets/icons/estoque.png';
import funcionariosIcon from '../../assets/icons/funcionarios.png';
import dietasIcon from '../../assets/icons/dietas.png';
import pesagemIcon from '../../assets/icons/pesagem.png';
import reproducaoIcon from '../../assets/icons/repro.png';
import './Admin.css';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verificarAdmin = async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email === 'admin@gmail.com' && currentUser.isAdmin === true) {
      return true;
    }

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
      
      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (usuariosError) throw usuariosError;

      const [animaisRes, lotesRes, vacinasRes, pesagensRes, funcionariosRes, estoqueRes, dietasRes, reproducoesRes] = await Promise.all([
        supabase.from('animais').select('id, sexo, usuario_id'),
        supabase.from('lotes').select('id, usuario_id'),
        supabase.from('vacinas_aplicadas').select('id, usuario_id'),
        supabase.from('pesagens').select('id, usuario_id'),
        supabase.from('funcionarios').select('id, usuario_id'),
        supabase.from('estoque').select('id, quantidade, preco_unitario, usuario_id'),
        supabase.from('dietas').select('id, usuario_id'),
        supabase.from('reproducoes').select('id, usuario_id')
      ]);

      const animais = animaisRes.data || [];
      const lotes = lotesRes.data || [];
      const vacinas = vacinasRes.data || [];
      const pesagens = pesagensRes.data || [];
      const funcionarios = funcionariosRes.data || [];
      const estoque = estoqueRes.data || [];
      const dietas = dietasRes.data || [];
      const reproducoes = reproducoesRes.data || [];

      const animaisPorUsuario = {};
      const machosPorUsuario = {};
      const femeasPorUsuario = {};
      const lotesPorUsuario = {};
      const vacinasPorUsuario = {};
      const pesagensPorUsuario = {};
      const funcionariosPorUsuario = {};
      const estoquePorUsuario = {};
      const valorEstoquePorUsuario = {};
      const dietasPorUsuario = {};
      const reproducoesPorUsuario = {};

      animais.forEach(animal => {
        if (!animal.usuario_id) return;
        animaisPorUsuario[animal.usuario_id] = (animaisPorUsuario[animal.usuario_id] || 0) + 1;
        if (animal.sexo === 'Macho') {
          machosPorUsuario[animal.usuario_id] = (machosPorUsuario[animal.usuario_id] || 0) + 1;
        } else if (animal.sexo === 'Fêmea') {
          femeasPorUsuario[animal.usuario_id] = (femeasPorUsuario[animal.usuario_id] || 0) + 1;
        }
      });

      lotes.forEach(lote => {
        if (lote.usuario_id) lotesPorUsuario[lote.usuario_id] = (lotesPorUsuario[lote.usuario_id] || 0) + 1;
      });

      vacinas.forEach(vacina => {
        if (vacina.usuario_id) vacinasPorUsuario[vacina.usuario_id] = (vacinasPorUsuario[vacina.usuario_id] || 0) + 1;
      });

      pesagens.forEach(pesagem => {
        if (pesagem.usuario_id) pesagensPorUsuario[pesagem.usuario_id] = (pesagensPorUsuario[pesagem.usuario_id] || 0) + 1;
      });

      funcionarios.forEach(func => {
        if (func.usuario_id) funcionariosPorUsuario[func.usuario_id] = (funcionariosPorUsuario[func.usuario_id] || 0) + 1;
      });

      estoque.forEach(item => {
        if (!item.usuario_id) return;
        estoquePorUsuario[item.usuario_id] = (estoquePorUsuario[item.usuario_id] || 0) + 1;
        valorEstoquePorUsuario[item.usuario_id] = (valorEstoquePorUsuario[item.usuario_id] || 0) + ((item.quantidade || 0) * (item.preco_unitario || 0));
      });

      dietas.forEach(dieta => {
        if (dieta.usuario_id) dietasPorUsuario[dieta.usuario_id] = (dietasPorUsuario[dieta.usuario_id] || 0) + 1;
      });

      reproducoes.forEach(repro => {
        if (repro.usuario_id) reproducoesPorUsuario[repro.usuario_id] = (reproducoesPorUsuario[repro.usuario_id] || 0) + 1;
      });

      const fazendasComDados = (usuariosData || []).map(usuario => ({
        ...usuario,
        total_animais: animaisPorUsuario[usuario.id] || 0,
        total_machos: machosPorUsuario[usuario.id] || 0,
        total_femeas: femeasPorUsuario[usuario.id] || 0,
        total_lotes: lotesPorUsuario[usuario.id] || 0,
        total_vacinas: vacinasPorUsuario[usuario.id] || 0,
        total_pesagens: pesagensPorUsuario[usuario.id] || 0,
        total_funcionarios: funcionariosPorUsuario[usuario.id] || 0,
        total_estoque: estoquePorUsuario[usuario.id] || 0,
        valor_estoque: valorEstoquePorUsuario[usuario.id] || 0,
        total_dietas: dietasPorUsuario[usuario.id] || 0,
        total_reproducoes: reproducoesPorUsuario[usuario.id] || 0
      }));
      
      setDetalhesFazendas(fazendasComDados);
      
      const totalAnimaisGeral = Object.values(animaisPorUsuario).reduce((a, b) => a + b, 0);
      const totalLotesGeral = Object.values(lotesPorUsuario).reduce((a, b) => a + b, 0);
      const totalVacinasGeral = Object.values(vacinasPorUsuario).reduce((a, b) => a + b, 0);
      const totalPesagensGeral = Object.values(pesagensPorUsuario).reduce((a, b) => a + b, 0);
      const totalFuncionariosGeral = Object.values(funcionariosPorUsuario).reduce((a, b) => a + b, 0);
      const totalEstoqueGeral = Object.values(estoquePorUsuario).reduce((a, b) => a + b, 0);
      const totalDietasGeral = Object.values(dietasPorUsuario).reduce((a, b) => a + b, 0);
      const totalReproducoesGeral = Object.values(reproducoesPorUsuario).reduce((a, b) => a + b, 0);
      
      setStats({
        totalUsuarios: usuariosData?.length || 0,
        totalFazendas: usuariosData?.length || 0,
        totalAnimais: totalAnimaisGeral,
        totalLotes: totalLotesGeral,
        totalVacinas: totalVacinasGeral,
        totalPesagens: totalPesagensGeral,
        totalFuncionarios: totalFuncionariosGeral,
        totalEstoque: totalEstoqueGeral,
        totalDietas: totalDietasGeral,
        totalReproducoes: totalReproducoesGeral
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
    { id: 'lotes', label: 'Lotes', icon: lotesIcon },
    { id: 'estoque', label: 'Estoque', icon: estoqueIcon },
    { id: 'vacinas', label: 'Vacinas', icon: vacinasIcon },
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
                    const profesional = detalhesFazendas.filter(u => u.plano === 'profissional').length;
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
                            <div className="bar" style={{ width: total > 0 ? `${(profesional / total) * 100}%` : '0%' }}>
                              {total > 0 ? Math.round((profesional / total) * 100) : 0}%
                            </div>
                          </div>
                          <span className="bar-count">{profesional} fazendas</span>
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

        {/* Fazendas - Lista detalhada */}
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

        {/* Lotes - Totais por fazenda */}
        {activeTab === 'lotes' && (
          <div className="admin-table-container">
            <h3>Distribuição de Lotes por Fazenda</h3>
            <div className="admin-stats-bar">
              <span>Total Geral: <strong>{stats.totalLotes}</strong> lotes</span>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fazenda</th>
                    <th>Total Lotes</th>
                    <th>% do Sistema</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhesFazendas.map(fazenda => (
                    <tr key={fazenda.id}>
                      <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                      <td>{fazenda.total_lotes}</td>
                      <td>
                        <div className="percent-bar">
                          <div className="percent-fill" style={{ width: `${stats.totalLotes > 0 ? (fazenda.total_lotes / stats.totalLotes) * 100 : 0}%` }}></div>
                          <span>{stats.totalLotes > 0 ? Math.round((fazenda.total_lotes / stats.totalLotes) * 100) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {detalhesFazendas.length === 0 && (
                    <tr>
                      <td colSpan="3" className="empty-message">Nenhum lote cadastrado</td>
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
            <h3>
              <img src={estoqueIcon} alt="Estoque" className="icon icon-sm" style={{ marginRight: '8px' }} />
              Distribuição de Estoque por Fazenda
            </h3>
            <div className="admin-stats-bar">
              <span>Total Geral: <strong>{stats.totalEstoque}</strong> itens em estoque</span>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fazenda</th>
                    <th>Itens em Estoque</th>
                    <th>Valor Total (R$)</th>
                    <th>% do Sistema</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhesFazendas.filter(f => f.total_estoque > 0).length > 0 ? (
                    detalhesFazendas
                      .filter(fazenda => fazenda.total_estoque > 0)
                      .map(fazenda => (
                        <tr key={fazenda.id}>
                          <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                          <td>{fazenda.total_estoque}</td>
                          <td>R$ {(fazenda.valor_estoque || 0).toFixed(2)}</td>
                          <td>
                            <div className="percent-bar">
                              <div className="percent-fill" style={{ width: `${stats.totalEstoque > 0 ? ((fazenda.total_estoque || 0) / stats.totalEstoque) * 100 : 0}%` }}></div>
                              <span>{stats.totalEstoque > 0 ? Math.round(((fazenda.total_estoque || 0) / stats.totalEstoque) * 100) : 0}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-message">
                        <img src={estoqueIcon} alt="Estoque" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                        <br />Nenhum item em estoque cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vacinas - Totais por fazenda */}
        {activeTab === 'vacinas' && (
          <div className="admin-table-container">
            <h3>
              <img src={vacinasIcon} alt="Vacinas" className="icon icon-sm" style={{ marginRight: '8px' }} />
              Distribuição de Vacinas por Fazenda
            </h3>
            <div className="admin-stats-bar">
              <span>Total Geral: <strong>{stats.totalVacinas}</strong> doses aplicadas</span>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fazenda</th>
                    <th>Doses Aplicadas</th>
                    <th>% do Sistema</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhesFazendas.filter(f => f.total_vacinas > 0).length > 0 ? (
                    detalhesFazendas
                      .filter(fazenda => fazenda.total_vacinas > 0)
                      .map(fazenda => (
                        <tr key={fazenda.id}>
                          <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                          <td>{fazenda.total_vacinas}</td>
                          <td>
                            <div className="percent-bar">
                              <div className="percent-fill" style={{ width: `${stats.totalVacinas > 0 ? ((fazenda.total_vacinas || 0) / stats.totalVacinas) * 100 : 0}%` }}></div>
                              <span>{stats.totalVacinas > 0 ? Math.round(((fazenda.total_vacinas || 0) / stats.totalVacinas) * 100) : 0}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="empty-message">
                        <img src={vacinasIcon} alt="Vacinas" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                        <br />Nenhuma vacina aplicada
                      </td>
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
                  {detalhesFazendas.filter(f => f.total_funcionarios > 0).length > 0 ? (
                    detalhesFazendas
                      .filter(fazenda => fazenda.total_funcionarios > 0)
                      .map(fazenda => (
                        <tr key={fazenda.id}>
                          <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                          <td>{fazenda.total_funcionarios}</td>
                          <td>
                            <div className="percent-bar">
                              <div className="percent-fill" style={{ width: `${stats.totalFuncionarios > 0 ? ((fazenda.total_funcionarios || 0) / stats.totalFuncionarios) * 100 : 0}%` }}></div>
                              <span>{stats.totalFuncionarios > 0 ? Math.round(((fazenda.total_funcionarios || 0) / stats.totalFuncionarios) * 100) : 0}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="empty-message">
                        <img src={funcionariosIcon} alt="Funcionários" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                        <br />Nenhum funcionário cadastrado
                      </td>
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
                  {detalhesFazendas.filter(f => f.total_dietas > 0).length > 0 ? (
                    detalhesFazendas
                      .filter(fazenda => fazenda.total_dietas > 0)
                      .map(fazenda => (
                        <tr key={fazenda.id}>
                          <td><strong>{fazenda.fazenda || fazenda.nome}</strong></td>
                          <td>{fazenda.total_dietas}</td>
                          <td>
                            <div className="percent-bar">
                              <div className="percent-fill" style={{ width: `${stats.totalDietas > 0 ? ((fazenda.total_dietas || 0) / stats.totalDietas) * 100 : 0}%` }}></div>
                              <span>{stats.totalDietas > 0 ? Math.round(((fazenda.total_dietas || 0) / stats.totalDietas) * 100) : 0}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="empty-message">
                        <img src={dietasIcon} alt="Dietas" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                        <br />Nenhuma dieta cadastrada
                      </td>
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
                <div className="relatorio-icon"><img src={relatoriosIcon} alt="Relatório" className="icon icon-md" /></div>
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