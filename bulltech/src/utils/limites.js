// Planos e seus limites
export const planos = {
  basico: {
    id: 'basico',
    nome: 'Plano Básico',
    limites: {
      animais: 100,
      lotes: 5,
      funcionarios: 3,
      vacinas: 50,
      pesagens: 200,
      estoque: 30,
      dietas: 10,
      reproducoes: 50
    }
  },
  profissional: {
    id: 'profissional',
    nome: 'Plano Profissional',
    limites: {
      animais: 400,
      lotes: 15,
      funcionarios: 10,
      vacinas: 200,
      pesagens: 1000,
      estoque: 100,
      dietas: 50,
      reproducoes: 200
    }
  },
  empresarial: {
    id: 'empresarial',
    nome: 'Plano Empresarial',
    limites: {
      animais: 2000,
      lotes: 100,
      funcionarios: 50,
      vacinas: 1000,
      pesagens: 10000,
      estoque: 500,
      dietas: 200,
      reproducoes: 1000
    }
  }
};

// Pegar plano atual do usuário
export const getPlanoAtual = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const planoId = user.plano || 'basico';
  return planos[planoId];
};

// Verificar se pode adicionar mais itens
export const podeAdicionar = (modulo, quantidadeAtual, quantidadeNova = 1) => {
  const plano = getPlanoAtual();
  const limite = plano.limites[modulo];
  const total = quantidadeAtual + quantidadeNova;
  
  return {
    permitido: total <= limite,
    limite,
    atual: quantidadeAtual,
    total,
    mensagem: total > limite ? `Limite do plano atingido! Seu ${plano.nome} permite no máximo ${limite} ${getNomeModulo(modulo)}. Faça upgrade para adicionar mais.` : null
  };
};

// Verificar limite antes de salvar
export const verificarLimiteAntesSalvar = (modulo, dadosAtuais, novoItem) => {
  const quantidadeAtual = dadosAtuais.length;
  const verificacao = podeAdicionar(modulo, quantidadeAtual);
  
  if (!verificacao.permitido) {
    alert(verificacao.mensagem);
    return false;
  }
  return true;
};

// Nome dos módulos para exibição
const getNomeModulo = (modulo) => {
  const nomes = {
    animais: 'animais',
    lotes: 'lotes',
    funcionarios: 'funcionários',
    vacinas: 'vacinas',
    pesagens: 'pesagens',
    estoque: 'itens no estoque',
    dietas: 'dietas',
    reproducoes: 'registros de reprodução'
  };
  return nomes[modulo] || modulo;
};

// Obter uso atual de cada módulo
export const getUsoAtual = () => {
  return {
    animais: JSON.parse(localStorage.getItem('animais') || '[]').length,
    lotes: JSON.parse(localStorage.getItem('lotes') || '[]').length,
    funcionarios: JSON.parse(localStorage.getItem('funcionarios') || '[]').length,
    vacinas: JSON.parse(localStorage.getItem('vacinas') || '[]').length,
    pesagens: JSON.parse(localStorage.getItem('pesagens') || '[]').length,
    estoque: JSON.parse(localStorage.getItem('estoque') || '[]').length,
    dietas: JSON.parse(localStorage.getItem('dietas') || '[]').length,
    reproducoes: JSON.parse(localStorage.getItem('reproducoes') || '[]').length
  };
};