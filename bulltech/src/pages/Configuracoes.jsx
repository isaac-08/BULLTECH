import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { authAPI, animaisAPI, lotesAPI, funcionariosAPI, vacinasAPI, pesagensAPI, estoqueAPI } from '../services/api';

// Importando os ícones da sidebar
import homeIcon from '../assets/icons/home.png';
import usuarioIcon from '../assets/icons/usuario.png';
import planosIcon from '../assets/icons/plano.png';
import cadastroIcon from '../assets/icons/cadastro.png';
import segurancaIcon from '../assets/icons/seguranca.png';
import configuracoesIcon from '../assets/icons/config.png';
import sistemaIcon from '../assets/icons/sistema.png';
import animalIcon from '../assets/icons/animais.png';

const Configuracoes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('perfil');
  const [upgrading, setUpgrading] = useState(false);
  
  const [avaliacao, setAvaliacao] = useState({
    nota: 0,
    comentario: '',
    recomendacao: '',
    enviada: false
  });
  const [avaliacoesExistentes, setAvaliacoesExistentes] = useState([]);
  const [mediaNotas, setMediaNotas] = useState(0);
  
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    fazenda: '',
    cargo: '',
    especialidade: ''
  });
  
  const [farmData, setFarmData] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: ''
  });
  
  const [securityData, setSecurityData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  
  const [preferences, setPreferences] = useState({
    tema: 'claro',
    notificacoes: true,
    idioma: 'pt-BR',
    dashboardLayout: 'grid'
  });

  const [stats, setStats] = useState({
    animais: 0,
    lotes: 0,
    funcionarios: 0,
    vacinas: 0,
    pesagens: 0,
    estoque: 0
  });

  const planos = {
    BASICO: {
      id: 'basico',
      nome: 'Plano Básico',
      preco: 99.90,
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
        '✓ Até 100 animais',
        '✓ Até 5 lotes',
        '✓ Até 3 funcionários',
        '✓ Relatórios básicos',
        '✓ Suporte por email'
      ]
    },
    PROFISSIONAL: {
      id: 'profissional',
      nome: 'Plano Profissional',
      preco: 199.90,
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
        '✓ Até 400 animais',
        '✓ Até 15 lotes',
        '✓ Até 10 funcionários',
        '✓ Relatórios básicos',
        '✓ Relatórios avançados',
        '✓ Suporte por email',
        '✓ Suporte WhatsApp'
      ]
    },
    EMPRESARIAL: {
      id: 'empresarial',
      nome: 'Plano Empresarial',
      preco: 399.90,
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
        '✓ Até 2000 animais',
        '✓ Até 100 lotes',
        '✓ Até 50 funcionários',
        '✓ Relatórios básicos',
        '✓ Relatórios avançados',
        '✓ Relatórios personalizados',
        '✓ Suporte prioritário',
        '✓ API de acesso'
      ]
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const { user: authUser, profile: userProfile } = await authAPI.getCurrentUser();
      
      if (!authUser) {
        navigate('/login');
        return;
      }
      
      setUser(authUser);
      setProfile(userProfile);
      
      setUserData({
        nome: userProfile?.nome || '',
        email: authUser.email || '',
        telefone: userProfile?.telefone || '',
        fazenda: userProfile?.fazenda || '',
        cargo: userProfile?.cargo || '',
        especialidade: userProfile?.especialidade || ''
      });
      
      setFarmData({
        nome: userProfile?.fazenda || '',
        endereco: userProfile?.endereco || '',
        cidade: userProfile?.cidade || '',
        estado: userProfile?.estado || '',
        cep: userProfile?.cep || '',
        telefone: userProfile?.telefone_fazenda || '',
        email: userProfile?.email_fazenda || ''
      });
      
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
      
      const [animais, lotes, funcionarios, vacinas, pesagens, estoque] = await Promise.all([
        animaisAPI.getAll(),
        lotesAPI.getAll(),
        funcionariosAPI.getAll(),
        vacinasAPI.getAll(),
        pesagensAPI.getAll(),
        estoqueAPI.getAll()
      ]);
      
      setStats({
        animais: animais.length,
        lotes: lotes.length,
        funcionarios: funcionarios.length,
        vacinas: vacinas.length,
        pesagens: pesagens.length,
        estoque: estoque.length
      });
      
      const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
      setAvaliacoesExistentes(avaliacoes);
      
      if (avaliacoes.length > 0) {
        const soma = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
        setMediaNotas(soma / avaliacoes.length);
      }
      
      const jaAvaliou = avaliacoes.some(a => a.usuarioId === authUser.id);
      if (jaAvaliou) {
        const avaliacaoUsuario = avaliacoes.find(a => a.usuarioId === authUser.id);
        setAvaliacao({
          ...avaliacaoUsuario,
          enviada: true
        });
      }
      
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFarmChange = (e) => {
    setFarmData({ ...farmData, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newPrefs = {
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    };
    setPreferences(newPrefs);
    localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome: userData.nome,
          telefone: userData.telefone,
          fazenda: userData.fazenda,
          cargo: userData.cargo,
          especialidade: userData.especialidade,
          endereco: farmData.endereco,
          cidade: farmData.cidade,
          estado: farmData.estado,
          cep: farmData.cep,
          telefone_fazenda: farmData.telefone,
          email_fazenda: farmData.email
        })
        .eq('auth_id', user.id);
      
      if (error) throw error;
      
      alert('Configurações salvas com sucesso!');
      
      const { profile: updatedProfile } = await authAPI.getCurrentUser();
      setProfile(updatedProfile);
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (securityData.novaSenha !== securityData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    
    if (securityData.novaSenha.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    setSaving(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: securityData.novaSenha
      });
      
      if (error) throw error;
      
      setSecurityData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      alert('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha');
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = (planoId) => {
    setUpgrading(true);
    setTimeout(() => {
      const plano = planos[planoId.toUpperCase()];
      localStorage.setItem('userPlano', planoId);
      localStorage.setItem('userPlanoNome', plano.nome);
      
      alert(`Plano atualizado para ${plano.nome} com sucesso!`);
      setUpgrading(false);
      window.location.reload();
    }, 1000);
  };

  const handleAvaliacaoChange = (campo, valor) => {
    setAvaliacao({ ...avaliacao, [campo]: valor });
  };

  const handleEnviarAvaliacao = () => {
    if (avaliacao.nota === 0) {
      alert('Por favor, selecione uma nota para avaliação');
      return;
    }
    
    if (!avaliacao.comentario.trim()) {
      alert('Por favor, escreva um comentário sobre sua experiência');
      return;
    }
    
    const novaAvaliacao = {
      id: Date.now(),
      usuarioId: user.id,
      usuarioNome: userData.nome,
      usuarioEmail: user.email,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      recomendacao: avaliacao.recomendacao,
      data: new Date().toISOString(),
      plano: localStorage.getItem('userPlano') || 'basico'
    };
    
    const avaliacoesExistentes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
    const usuarioJaAvaliou = avaliacoesExistentes.findIndex(a => a.usuarioId === user.id);
    
    if (usuarioJaAvaliou !== -1) {
      avaliacoesExistentes[usuarioJaAvaliou] = novaAvaliacao;
    } else {
      avaliacoesExistentes.push(novaAvaliacao);
    }
    
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoesExistentes));
    
    setAvaliacao({
      ...avaliacao,
      enviada: true
    });
    
    alert('Obrigado pela sua avaliação! Sua opinião é muito importante para nós.');
  };

  const renderEstrelas = (nota, readonly = false, onChange = null) => {
    return (
      <div className="estrelas-container" style={{ display: 'flex', gap: '5px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`estrela ${star <= nota ? 'active' : ''}`}
            onClick={() => !readonly && onChange && onChange(star)}
            style={{ 
              cursor: readonly ? 'default' : 'pointer',
              fontSize: '24px',
              color: star <= nota ? '#f1c40f' : '#ddd'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Seções com os ícones da sidebar
  const sections = [
    { id: 'perfil', label: 'Perfil do Usuário', icon: usuarioIcon },
    { id: 'fazenda', label: 'Dados da Fazenda', icon: homeIcon },
    { id: 'planos', label: 'Planos', icon: planosIcon },
    { id: 'avaliacao', label: 'Avalie o Site', icon: cadastroIcon },
    { id: 'seguranca', label: 'Segurança', icon: segurancaIcon },
    { id: 'preferencias', label: 'Preferências', icon: configuracoesIcon },
    { id: 'sistema', label: 'Sistema', icon: sistemaIcon }
  ];

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Configurações</h2>
          <p>Gerencie as configurações do sistema</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  const planoAtual = localStorage.getItem('userPlano') || 'basico';
  const planoAtualNome = planos[planoAtual.toUpperCase()]?.nome || 'Plano Básico';
  const limitesAtuais = planos[planoAtual.toUpperCase()]?.limites || planos.BASICO.limites;

  return (
    <>
      <div className="welcome-section">
        <h2>
          <img src={configuracoesIcon} alt="Configurações" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Configurações
        </h2>
        <p>Gerencie as configurações do sistema</p>
      </div>
      
      <div className="page-content">
        <div className="config-container" style={{ display: 'flex', gap: '20px' }}>
          
          <div className="config-sidebar" style={{ width: '250px', flexShrink: 0 }}>
            {sections.map(section => (
              <button
                key={section.id}
                className={`config-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  marginBottom: '5px',
                  textAlign: 'left',
                  background: activeSection === section.id ? '#2D6A4F' : 'transparent',
                  color: activeSection === section.id ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <img src={section.icon} alt={section.label} className="icon icon-sm" style={{ width: '20px', height: '20px' }} />
                <span>{section.label}</span>
              </button>
            ))}
          </div>
          
          <div className="config-content" style={{ flex: 1 }}>
            
            {activeSection === 'perfil' && (
              <div className="config-section">
                <h3>
                  <img src={usuarioIcon} alt="Perfil" className="icon icon-sm" style={{ marginRight: '8px' }} />
                  Perfil do Usuário
                </h3>
                <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                  Estas informações foram preenchidas no seu cadastro e podem ser alteradas aqui.
                </p>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input type="text" name="nome" value={userData.nome} onChange={handleUserChange} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={userData.email} disabled />
                    <small style={{ color: '#666' }}>O email não pode ser alterado</small>
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input type="tel" name="telefone" value={userData.telefone} onChange={handleUserChange} placeholder="(11) 99999-9999" />
                  </div>
                  <div className="form-group">
                    <label>Fazenda</label>
                    <input type="text" name="fazenda" value={userData.fazenda} onChange={handleUserChange} />
                  </div>
                  <div className="form-group">
                    <label>Cargo</label>
                    <input type="text" name="cargo" value={userData.cargo} onChange={handleUserChange} placeholder="Ex: Veterinário, Administrador" />
                  </div>
                  <div className="form-group">
                    <label>Especialidade</label>
                    <input type="text" name="especialidade" value={userData.especialidade} onChange={handleUserChange} placeholder="Ex: Bovinocultura" />
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'fazenda' && (
              <div className="config-section">
                <h3>
                  <img src={homeIcon} alt="Fazenda" className="icon icon-sm" style={{ marginRight: '8px' }} />
                  Dados da Fazenda
                </h3>
                <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                  Estas informações foram preenchidas no seu cadastro e podem ser alteradas aqui.
                </p>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  <div className="form-group">
                    <label>Nome da Fazenda</label>
                    <input type="text" name="nome" value={farmData.nome} onChange={handleFarmChange} />
                  </div>
                  <div className="form-group">
                    <label>Endereço</label>
                    <input type="text" name="endereco" value={farmData.endereco} onChange={handleFarmChange} />
                  </div>
                  <div className="form-group">
                    <label>Cidade</label>
                    <input type="text" name="cidade" value={farmData.cidade} onChange={handleFarmChange} />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <input type="text" name="estado" value={farmData.estado} onChange={handleFarmChange} />
                  </div>
                  <div className="form-group">
                    <label>CEP</label>
                    <input type="text" name="cep" value={farmData.cep} onChange={handleFarmChange} />
                  </div>
                  <div className="form-group">
                    <label>Telefone da Fazenda</label>
                    <input type="tel" name="telefone" value={farmData.telefone} onChange={handleFarmChange} />
                  </div>
                  <div className="form-group">
                    <label>Email da Fazenda</label>
                    <input type="email" name="email" value={farmData.email} onChange={handleFarmChange} />
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'planos' && (
              <div className="config-section">
                <h3>
                  <img src={planosIcon} alt="Planos" className="icon icon-sm" style={{ marginRight: '8px' }} />
                  Planos e Assinatura
                </h3>
                
                <div className="plano-atual" style={{ marginBottom: '20px', padding: '15px', background: '#e8f4f8', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Plano Atual:</span>
                    <span style={{ color: '#2D6A4F', fontWeight: 'bold' }}>{planoAtualNome}</span>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontWeight: 'bold' }}>Seus limites atuais:</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      <li>{stats.animais > limitesAtuais.maxAnimais ? '⚠️' : '✓'} Até {limitesAtuais.maxAnimais} animais (atual: {stats.animais})</li>
                      <li>{stats.lotes > limitesAtuais.maxLotes ? '⚠️' : '✓'} Até {limitesAtuais.maxLotes} lotes (atual: {stats.lotes})</li>
                      <li>{stats.funcionarios > limitesAtuais.maxFuncionarios ? '⚠️' : '✓'} Até {limitesAtuais.maxFuncionarios} funcionários (atual: {stats.funcionarios})</li>
                      <li>✓ Até {limitesAtuais.maxVacinas} vacinas</li>
                      <li>✓ Até {limitesAtuais.maxPesagens} pesagens</li>
                      <li>✓ Até {limitesAtuais.maxEstoque} itens no estoque</li>
                    </ul>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {Object.values(planos).map(plano => (
                    <div key={plano.id} style={{
                      flex: 1,
                      minWidth: '250px',
                      border: planoAtual === plano.id ? '2px solid #2D6A4F' : '1px solid #ddd',
                      borderRadius: '10px',
                      padding: '15px',
                      position: 'relative'
                    }}>
                      {planoAtual === plano.id && (
                        <div style={{ position: 'absolute', top: '-10px', right: '10px', background: '#2D6A4F', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' }}>Atual</div>
                      )}
                      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <h4>{plano.nome}</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>R$ {plano.preco.toFixed(2)}<span style={{ fontSize: '12px', fontWeight: 'normal' }}>/mês</span></div>
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        {plano.recursos.map((recurso, index) => (
                          <div key={index} style={{ marginBottom: '5px', fontSize: '13px' }}>{recurso}</div>
                        ))}
                      </div>
                      {planoAtual !== plano.id ? (
                        <button onClick={() => handleUpgrade(plano.id)} disabled={upgrading} style={{ width: '100%', padding: '10px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                          {upgrading ? 'Processando...' : `Upgrade para ${plano.nome}`}
                        </button>
                      ) : (
                        <button disabled style={{ width: '100%', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px' }}>Plano Atual</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === 'avaliacao' && (
              <div className="config-section">
                <h3>
                  <img src={cadastroIcon} alt="Avaliação" className="icon icon-sm" style={{ marginRight: '8px' }} />
                  Avalie o BULLTECH
                </h3>
                
                {avaliacoesExistentes.length > 0 && (
                  <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold' }}>Média geral do sistema</div>
                    <div>
                      <span style={{ fontSize: '28px', fontWeight: 'bold' }}>{mediaNotas.toFixed(1)}</span>
                      <span>{renderEstrelas(Math.round(mediaNotas), true)}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Baseado em {avaliacoesExistentes.length} avaliação(ões)</div>
                  </div>
                )}
                
                {!avaliacao.enviada ? (
                  <div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Qual sua nota para o BULLTECH? *</label>
                      <div>
                        {renderEstrelas(avaliacao.nota, false, (nota) => handleAvaliacaoChange('nota', nota))}
                        <span style={{ marginLeft: '10px' }}>
                          {avaliacao.nota === 1 && 'Muito Ruim'}
                          {avaliacao.nota === 2 && 'Ruim'}
                          {avaliacao.nota === 3 && 'Regular'}
                          {avaliacao.nota === 4 && 'Bom'}
                          {avaliacao.nota === 5 && 'Excelente!'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>O que você achou do sistema? *</label>
                      <textarea rows="4" value={avaliacao.comentario} onChange={(e) => handleAvaliacaoChange('comentario', e.target.value)} placeholder="Conte-nos sobre sua experiência com o BULLTECH..." />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Você recomendaria o BULLTECH?</label>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <input type="radio" name="recomendacao" value="sim" checked={avaliacao.recomendacao === 'sim'} onChange={(e) => handleAvaliacaoChange('recomendacao', e.target.value)} />
                          <span>Sim</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <input type="radio" name="recomendacao" value="talvez" checked={avaliacao.recomendacao === 'talvez'} onChange={(e) => handleAvaliacaoChange('recomendacao', e.target.value)} />
                          <span>Talvez</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <input type="radio" name="recomendacao" value="nao" checked={avaliacao.recomendacao === 'nao'} onChange={(e) => handleAvaliacaoChange('recomendacao', e.target.value)} />
                          <span>Não</span>
                        </label>
                      </div>
                    </div>
                    
                    <button onClick={handleEnviarAvaliacao} style={{ padding: '10px 20px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Enviar Avaliação</button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', background: '#e8f4f8', borderRadius: '10px' }}>
                    <div style={{ fontSize: '48px' }}>🙏</div>
                    <h4>Obrigado pela sua avaliação!</h4>
                    <p>Sua opinião nos ajuda a melhorar cada vez mais o BULLTECH.</p>
                    <div>
                      <div>Sua nota: {renderEstrelas(avaliacao.nota, true)}</div>
                      <div><strong>Seu comentário:</strong> "{avaliacao.comentario}"</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeSection === 'seguranca' && (
              <div className="config-section">
                <h3>
                  <img src={segurancaIcon} alt="Segurança" className="icon icon-sm" style={{ marginRight: '8px' }} />
                  Alterar Senha
                </h3>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  <div className="form-group">
                    <label>Nova Senha</label>
                    <input type="password" name="novaSenha" value={securityData.novaSenha} onChange={handleSecurityChange} />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Nova Senha</label>
                    <input type="password" name="confirmarSenha" value={securityData.confirmarSenha} onChange={handleSecurityChange} />
                  </div>
                </div>
                <button onClick={handleChangePassword} disabled={saving} style={{ padding: '10px 20px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  {saving ? 'Salvando...' : 'Alterar Senha'}
                </button>
              </div>
            )}
            
            {activeSection === 'preferencias' && (
              <div className="config-section">
                <h3>
                  <img src={configuracoesIcon} alt="Preferências" className="icon icon-sm" style={{ marginRight: '8px' }} />
                  Preferências do Sistema
                </h3>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  <div className="form-group">
                    <label>Tema</label>
                    <select name="tema" value={preferences.tema} onChange={handlePreferencesChange}>
                      <option value="claro">Claro</option>
                      <option value="escuro">Escuro</option>
                      <option value="sistema">Sistema</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Idioma</label>
                    <select name="idioma" value={preferences.idioma} onChange={handlePreferencesChange}>
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Layout do Dashboard</label>
                    <select name="dashboardLayout" value={preferences.dashboardLayout} onChange={handlePreferencesChange}>
                      <option value="grid">Grid</option>
                      <option value="lista">Lista</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" name="notificacoes" checked={preferences.notificacoes} onChange={handlePreferencesChange} />
                      Receber notificações por email
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'sistema' && (
              <div className="config-section">
                <h3>
                  <img src={sistemaIcon} alt="Sistema" className="icon icon-sm" style={{ marginRight: '8px' }} />
                  Informações do Sistema
                </h3>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold' }}>Versão do Sistema:</span><span>2.0.0</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold' }}>Total de Animais:</span><span>{stats.animais}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold' }}>Total de Lotes:</span><span>{stats.lotes}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold' }}>Total de Funcionários:</span><span>{stats.funcionarios}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold' }}>Total de Vacinas:</span><span>{stats.vacinas}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold' }}>Total de Pesagens:</span><span>{stats.pesagens}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '5px 0' }}>
                    <span style={{ fontWeight: 'bold' }}>Total em Estoque:</span><span>{stats.estoque}</span>
                  </div>
                </div>
                
                <div style={{ borderTop: '2px solid #e74c3c', paddingTop: '20px' }}>
                  <h4 style={{ color: '#e74c3c', marginBottom: '10px' }}>⚠️ Zona de Perigo</h4>
                  <button onClick={() => {
                    if (window.confirm('Tem certeza que deseja limpar todos os dados do cache? Esta ação não pode ser desfeita!')) {
                      localStorage.clear();
                      window.location.href = '/login';
                    }
                  }} style={{ padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Limpar Dados do Cache Local
                  </button>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                    Isso limpará apenas os dados do cache local. Seus dados no Supabase permanecerão intactos.
                  </p>
                </div>
              </div>
            )}
            
            {activeSection !== 'seguranca' && activeSection !== 'planos' && activeSection !== 'avaliacao' && activeSection !== 'sistema' && (
              <div style={{ marginTop: '20px' }}>
                <button onClick={handleSaveProfile} disabled={saving} style={{ padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuracoes;