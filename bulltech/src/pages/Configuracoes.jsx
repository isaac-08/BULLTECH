import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Configuracoes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('perfil');
  const [upgrading, setUpgrading] = useState(false);
  
  // Dados da avaliação
  const [avaliacao, setAvaliacao] = useState({
    nota: 0,
    comentario: '',
    recomendacao: '',
    enviada: false
  });
  const [avaliacoesExistentes, setAvaliacoesExistentes] = useState([]);
  const [mediaNotas, setMediaNotas] = useState(0);
  
  // Dados do usuário
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    fazenda: '',
    cargo: '',
    especialidade: ''
  });
  
  // Dados da fazenda
  const [farmData, setFarmData] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: ''
  });
  
  // Segurança
  const [securityData, setSecurityData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  
  // Preferências
  const [preferences, setPreferences] = useState({
    tema: 'claro',
    notificacoes: true,
    idioma: 'pt-BR',
    dashboardLayout: 'grid'
  });

  // Planos
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
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(currentUser);
    setUser(user);
    
    // Carregar dados salvos
    const savedUserData = localStorage.getItem('userConfig');
    if (savedUserData) {
      const data = JSON.parse(savedUserData);
      setUserData(data.userData || {
        nome: user.nome,
        email: user.email,
        telefone: '',
        fazenda: user.fazenda || '',
        cargo: '',
        especialidade: ''
      });
      setFarmData(data.farmData || {
        nome: user.fazenda || '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        telefone: '',
        email: user.email
      });
      setPreferences(data.preferences || {
        tema: 'claro',
        notificacoes: true,
        idioma: 'pt-BR',
        dashboardLayout: 'grid'
      });
    } else {
      setUserData({
        nome: user.nome,
        email: user.email,
        telefone: '',
        fazenda: user.fazenda || '',
        cargo: '',
        especialidade: ''
      });
      setFarmData({
        nome: user.fazenda || '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        telefone: '',
        email: user.email
      });
    }
    
    // Carregar avaliações
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
    setAvaliacoesExistentes(avaliacoes);
    
    // Calcular média
    if (avaliacoes.length > 0) {
      const soma = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
      setMediaNotas(soma / avaliacoes.length);
    }
    
    // Verificar se usuário já avaliou
    const jaAvaliou = avaliacoes.some(a => a.usuarioId === user.id);
    if (jaAvaliou) {
      const avaliacaoUsuario = avaliacoes.find(a => a.usuarioId === user.id);
      setAvaliacao({
        ...avaliacaoUsuario,
        enviada: true
      });
    }
    
    setLoading(false);
  }, [navigate]);

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
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveProfile = () => {
    setSaving(true);
    
    // Atualizar usuário no localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].nome = userData.nome;
      users[userIndex].email = userData.email;
      users[userIndex].fazenda = userData.fazenda;
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Atualizar currentUser
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.nome = userData.nome;
    currentUser.email = userData.email;
    currentUser.fazenda = userData.fazenda;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Salvar todas as configurações
    const allConfig = {
      userData,
      farmData,
      preferences
    };
    localStorage.setItem('userConfig', JSON.stringify(allConfig));
    
    setTimeout(() => {
      setSaving(false);
      alert('Configurações salvas com sucesso!');
    }, 500);
  };

  const handleChangePassword = () => {
    if (securityData.novaSenha !== securityData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    
    if (securityData.novaSenha.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    setSaving(true);
    
    // Atualizar senha no localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].senha = securityData.novaSenha;
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    setSecurityData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    
    setTimeout(() => {
      setSaving(false);
      alert('Senha alterada com sucesso!');
    }, 500);
  };

  const handleUpgrade = (planoId) => {
    setUpgrading(true);
    setTimeout(() => {
      const plano = planos[planoId.toUpperCase()];
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUser.plano = planoId;
      currentUser.planoNome = plano.nome;
      currentUser.limites = plano.limites;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Atualizar na lista de usuários
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex].plano = planoId;
        users[userIndex].planoNome = plano.nome;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
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
      usuarioNome: user.nome,
      usuarioEmail: user.email,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      recomendacao: avaliacao.recomendacao,
      data: new Date().toISOString(),
      plano: user.plano || 'basico'
    };
    
    const avaliacoesExistentes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
    const usuarioJaAvaliou = avaliacoesExistentes.findIndex(a => a.usuarioId === user.id);
    
    if (usuarioJaAvaliou !== -1) {
      // Atualizar avaliação existente
      avaliacoesExistentes[usuarioJaAvaliou] = novaAvaliacao;
    } else {
      // Adicionar nova avaliação
      avaliacoesExistentes.push(novaAvaliacao);
    }
    
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoesExistentes));
    
    setAvaliacao({
      ...avaliacao,
      enviada: true
    });
    
    alert('Obrigado pela sua avaliação! Sua opinião é muito importante para nós.');
  };

  const sections = [
    { id: 'perfil', label: 'Perfil do Usuário', icon: '👤' },
    { id: 'fazenda', label: 'Dados da Fazenda', icon: '🏠' },
    { id: 'planos', label: 'Planos', icon: '⭐' },
    { id: 'avaliacao', label: 'Avalie o Site', icon: '📝' },
    { id: 'seguranca', label: 'Segurança', icon: '🔒' },
    { id: 'preferencias', label: 'Preferências', icon: '⚙️' },
    { id: 'sistema', label: 'Sistema', icon: '💻' }
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

  const planoAtual = user?.plano || 'basico';
  const planoAtualNome = planos[planoAtual.toUpperCase()]?.nome || 'Plano Básico';
  const limitesAtuais = planos[planoAtual.toUpperCase()]?.limites || planos.BASICO.limites;

  // Verificar uso atual
  const animaisAtuais = JSON.parse(localStorage.getItem('animais') || '[]').length;
  const lotesAtuais = JSON.parse(localStorage.getItem('lotes') || '[]').length;
  const funcionariosAtuais = JSON.parse(localStorage.getItem('funcionarios') || '[]').length;

  const renderEstrelas = (nota, readonly = false, onChange = null) => {
    return (
      <div className="estrelas-container">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`estrela ${star <= nota ? 'active' : ''}`}
            onClick={() => !readonly && onChange(star)}
            style={{ cursor: readonly ? 'default' : 'pointer' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="welcome-section">
        <h2>Configurações</h2>
        <p>Gerencie as configurações do sistema</p>
      </div>
      
      <div className="page-content">
        <div className="config-container">
          {/* Sidebar de configurações */}
          <div className="config-sidebar">
            {sections.map(section => (
              <button
                key={section.id}
                className={`config-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="config-icon">{section.icon}</span>
                <span className="config-label">{section.label}</span>
              </button>
            ))}
          </div>
          
          {/* Conteúdo das configurações */}
          <div className="config-content">
            {/* Perfil do Usuário */}
            {activeSection === 'perfil' && (
              <div className="config-section">
                <h3>Perfil do Usuário</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input type="text" name="nome" value={userData.nome} onChange={handleUserChange} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={userData.email} onChange={handleUserChange} />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input type="tel" name="telefone" value={userData.telefone} onChange={handleUserChange} placeholder="(11) 99999-9999" />
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
            
            {/* Dados da Fazenda */}
            {activeSection === 'fazenda' && (
              <div className="config-section">
                <h3>Dados da Fazenda</h3>
                <div className="form-grid">
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
                    <label>Telefone</label>
                    <input type="tel" name="telefone" value={farmData.telefone} onChange={handleFarmChange} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={farmData.email} onChange={handleFarmChange} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Planos */}
            {activeSection === 'planos' && (
              <div className="config-section">
                <h3>Planos e Assinatura</h3>
                
                <div className="plano-atual">
                  <div className="plano-atual-info">
                    <span className="plano-atual-label">Plano Atual:</span>
                    <span className="plano-atual-nome">{planoAtualNome}</span>
                  </div>
                  <div className="plano-limites">
                    <p>Seus limites atuais:</p>
                    <ul>
                      <li className={animaisAtuais > limitesAtuais.maxAnimais ? 'limite-atingido' : ''}>
                        {animaisAtuais > limitesAtuais.maxAnimais ? '⚠️' : '✓'} Até {limitesAtuais.maxAnimais} animais (atual: {animaisAtuais})
                      </li>
                      <li className={lotesAtuais > limitesAtuais.maxLotes ? 'limite-atingido' : ''}>
                        {lotesAtuais > limitesAtuais.maxLotes ? '⚠️' : '✓'} Até {limitesAtuais.maxLotes} lotes (atual: {lotesAtuais})
                      </li>
                      <li className={funcionariosAtuais > limitesAtuais.maxFuncionarios ? 'limite-atingido' : ''}>
                        {funcionariosAtuais > limitesAtuais.maxFuncionarios ? '⚠️' : '✓'} Até {limitesAtuais.maxFuncionarios} funcionários (atual: {funcionariosAtuais})
                      </li>
                      <li>✓ Até {limitesAtuais.maxVacinas} vacinas</li>
                      <li>✓ Até {limitesAtuais.maxPesagens} pesagens</li>
                      <li>✓ Até {limitesAtuais.maxEstoque} itens no estoque</li>
                    </ul>
                  </div>
                </div>
                
                <div className="planos-container-config">
                  {Object.values(planos).map(plano => (
                    <div key={plano.id} className={`plano-card-config ${planoAtual === plano.id ? 'current' : ''}`}>
                      {planoAtual === plano.id && <div className="plano-badge-config">Atual</div>}
                      <div className="plano-header-config">
                        <h4>{plano.nome}</h4>
                        <div className="plano-preco-config">
                          R$ {plano.preco.toFixed(2)}
                          <span>/mês</span>
                        </div>
                      </div>
                      <div className="plano-recursos-config">
                        {plano.recursos.map((recurso, index) => (
                          <div key={index} className="recurso-item-config">{recurso}</div>
                        ))}
                      </div>
                      {planoAtual !== plano.id ? (
                        <button 
                          className="plano-select-btn-config"
                          onClick={() => handleUpgrade(plano.id)}
                          disabled={upgrading}
                        >
                          {upgrading ? 'Processando...' : `Upgrade para ${plano.nome}`}
                        </button>
                      ) : (
                        <button className="plano-select-btn-config current" disabled>
                          Plano Atual
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Avaliação do Site */}
            {activeSection === 'avaliacao' && (
              <div className="config-section avaliacao-section">
                <h3>Avalie o BULLTECH</h3>
                
                {/* Média geral do site */}
                {avaliacoesExistentes.length > 0 && (
                  <div className="media-geral">
                    <div className="media-geral-titulo">Média geral do sistema</div>
                    <div className="media-geral-nota">
                      <span className="media-nota">{mediaNotas.toFixed(1)}</span>
                      <span className="media-estrelas">{renderEstrelas(Math.round(mediaNotas), true)}</span>
                    </div>
                    <div className="media-geral-total">
                      Baseado em {avaliacoesExistentes.length} avaliação(ões)
                    </div>
                  </div>
                )}
                
                {!avaliacao.enviada ? (
                  <div className="avaliacao-form">
                    
                    
                    <div className="form-group">
                      <label>Qual sua nota para o BULLTECH? *</label>
                      <div className="nota-input">
                        {renderEstrelas(avaliacao.nota, false, (nota) => handleAvaliacaoChange('nota', nota))}
                        <span className="nota-texto">
                          {avaliacao.nota === 1 && 'Muito Ruim'}
                          {avaliacao.nota === 2 && 'Ruim'}
                          {avaliacao.nota === 3 && 'Regular'}
                          {avaliacao.nota === 4 && 'Bom'}
                          {avaliacao.nota === 5 && 'Excelente!'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>O que você achou do sistema? *</label>
                      <textarea
                        rows="4"
                        value={avaliacao.comentario}
                        onChange={(e) => handleAvaliacaoChange('comentario', e.target.value)}
                        placeholder="Conte-nos sobre sua experiência com o BULLTECH. O que mais gostou? O que poderia melhorar?"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Você recomendaria o BULLTECH para outros produtores?</label>
                      <div className="recomendacao-opcoes">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="recomendacao"
                            value="sim"
                            checked={avaliacao.recomendacao === 'sim'}
                            onChange={(e) => handleAvaliacaoChange('recomendacao', e.target.value)}
                          />
                          <span>Sim, definitivamente</span>
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="recomendacao"
                            value="talvez"
                            checked={avaliacao.recomendacao === 'talvez'}
                            onChange={(e) => handleAvaliacaoChange('recomendacao', e.target.value)}
                          />
                          <span>Talvez</span>
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="recomendacao"
                            value="nao"
                            checked={avaliacao.recomendacao === 'nao'}
                            onChange={(e) => handleAvaliacaoChange('recomendacao', e.target.value)}
                          />
                          <span>Não recomendaria</span>
                        </label>
                      </div>
                    </div>
                    
                    <button className="btn-avaliar" onClick={handleEnviarAvaliacao}>
                      Enviar Avaliação
                    </button>
                  </div>
                ) : (
                  <div className="avaliacao-agradecimento">
                    <div className="agradecimento-icon">🙏</div>
                    <h4>Obrigado pela sua avaliação!</h4>
                    <p>Sua opinião nos ajuda a melhorar cada vez mais o BULLTECH.</p>
                    <div className="avaliacao-enviada">
                      <div className="avaliacao-nota-enviada">
                        Sua nota: {renderEstrelas(avaliacao.nota, true)}
                      </div>
                      <div className="avaliacao-comentario-enviado">
                        <strong>Seu comentário:</strong>
                        <p>"{avaliacao.comentario}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Segurança */}
            {activeSection === 'seguranca' && (
              <div className="config-section">
                <h3>Alterar Senha</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Senha Atual</label>
                    <input type="password" name="senhaAtual" value={securityData.senhaAtual} onChange={handleSecurityChange} />
                  </div>
                  <div className="form-group">
                    <label>Nova Senha</label>
                    <input type="password" name="novaSenha" value={securityData.novaSenha} onChange={handleSecurityChange} />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Nova Senha</label>
                    <input type="password" name="confirmarSenha" value={securityData.confirmarSenha} onChange={handleSecurityChange} />
                  </div>
                </div>
                <button className="btn-save" onClick={handleChangePassword} disabled={saving}>
                  {saving ? 'Salvando...' : 'Alterar Senha'}
                </button>
              </div>
            )}
            
            {/* Preferências */}
            {activeSection === 'preferencias' && (
              <div className="config-section">
                <h3>Preferências do Sistema</h3>
                <div className="form-grid">
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
                  <div className="form-group checkbox">
                    <label>
                      <input type="checkbox" name="notificacoes" checked={preferences.notificacoes} onChange={handlePreferencesChange} />
                      Receber notificações por email
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Sistema */}
            {activeSection === 'sistema' && (
              <div className="config-section">
                <h3>Informações do Sistema</h3>
                <div className="info-box">
                  <div className="info-row">
                    <span className="info-label">Versão do Sistema:</span>
                    <span className="info-value">1.0.0</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Data da Última Atualização:</span>
                    <span className="info-value">15/03/2026</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Total de Animais:</span>
                    <span className="info-value">{animaisAtuais}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Total de Lotes:</span>
                    <span className="info-value">{lotesAtuais}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Total de Vacinas:</span>
                    <span className="info-value">{JSON.parse(localStorage.getItem('vacinas') || '[]').length}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Espaço Utilizado:</span>
                    <span className="info-value">~ 2.5 MB</span>
                  </div>
                </div>
                
                <div className="danger-zone">
                  <h4>Zona de Perigo</h4>
                  <button className="btn-danger" onClick={() => {
                    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita!')) {
                      localStorage.clear();
                      window.location.href = '/';
                    }
                  }}>
                    Limpar Todos os Dados
                  </button>
                </div>
              </div>
            )}
            
            {/* Botão Salvar (exceto nas abas de segurança, planos, avaliação e sistema) */}
            {activeSection !== 'seguranca' && activeSection !== 'planos' && activeSection !== 'avaliacao' && activeSection !== 'sistema' && (
              <div className="form-actions">
                <button className="btn-save" onClick={handleSaveProfile} disabled={saving}>
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