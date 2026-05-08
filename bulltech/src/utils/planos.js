export const planos = {
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
      maxReproducoes: 50,
      relatoriosBasicos: true,
      suporteEmail: true,
      suporteWhatsapp: false,
      exportarDados: false
    },
    recursos: [
      '✓ Até 100 animais',
      '✓ Até 5 lotes',
      '✓ Até 3 funcionários',
      '✓ Relatórios básicos',
      '✓ Suporte por email',
      '✗ Suporte WhatsApp',
      '✗ Exportação de dados'
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
      maxReproducoes: 200,
      relatoriosBasicos: true,
      relatoriosAvancados: true,
      suporteEmail: true,
      suporteWhatsapp: true,
      exportarDados: true
    },
    recursos: [
      '✓ Até 400 animais',
      '✓ Até 15 lotes',
      '✓ Até 10 funcionários',
      '✓ Relatórios básicos',
      '✓ Relatórios avançados',
      '✓ Suporte por email',
      '✓ Suporte WhatsApp',
      '✓ Exportação de dados'
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
      maxReproducoes: 1000,
      relatoriosBasicos: true,
      relatoriosAvancados: true,
      relatoriosPersonalizados: true,
      suporteEmail: true,
      suporteWhatsapp: true,
      suportePrioritario: true,
      exportarDados: true,
      apiAcesso: true
    },
    recursos: [
      '✓ Até 2000 animais',
      '✓ Até 100 lotes',
      '✓ Até 50 funcionários',
      '✓ Relatórios básicos',
      '✓ Relatórios avançados',
      '✓ Relatórios personalizados',
      '✓ Suporte prioritário',
      '✓ Exportação de dados',
      '✓ API de acesso'
    ]
  }
};

// Função para verificar limites
export const verificarLimite = (plano, modulo, quantidadeAtual, novaQuantidade = 1) => {
  const limites = planos[plano]?.limites;
  if (!limites) return { permitido: true, mensagem: '' };
  
  const limiteMaximo = limites[modulo];
  if (limiteMaximo === undefined) return { permitido: true, mensagem: '' };
  
  const novaTotal = quantidadeAtual + novaQuantidade;
  
  if (novaTotal > limiteMaximo) {
    return {
      permitido: false,
      mensagem: `Limite do plano excedido! Seu plano permite no máximo ${limiteMaximo} ${modulo === 'maxAnimais' ? 'animais' : modulo === 'maxLotes' ? 'lotes' : modulo === 'maxFuncionarios' ? 'funcionários' : modulo === 'maxVacinas' ? 'vacinas' : modulo === 'maxPesagens' ? 'pesagens' : modulo === 'maxEstoque' ? 'itens no estoque' : modulo === 'maxDietas' ? 'dietas' : modulo === 'maxReproducoes' ? 'registros de reprodução' : ''}. Faça upgrade para adicionar mais.`
    };
  }
  
  return { permitido: true, mensagem: '' };
};

// Função para obter o plano atual do usuário
export const getPlanoUsuario = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user.plano || 'basico';
};

// Função para atualizar o plano do usuário
export const atualizarPlano = (planoId) => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  user.plano = planoId;
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Atualizar também na lista de usuários
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex].plano = planoId;
    localStorage.setItem('users', JSON.stringify(users));
  }
};