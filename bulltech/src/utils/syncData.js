// Sincronizar estatísticas de lotes baseado nos animais
export const syncLotesStats = () => {
  const lotes = JSON.parse(localStorage.getItem('lotes') || '[]');
  const animais = JSON.parse(localStorage.getItem('animais') || '[]');
  
  const lotesAtualizados = lotes.map(lote => {
    // Buscar animais que pertencem a este lote (pelo nome do lote ou ID)
    const animaisDoLote = animais.filter(a => {
      return a.lote === lote.codigo || 
             a.lote === lote.id?.toString() ||
             (lote.codigo && a.lote === lote.codigo);
    });
    
    const totalAnimais = animaisDoLote.length;
    const totalMachos = animaisDoLote.filter(a => a.sexo === 'Macho').length;
    const totalFemeas = animaisDoLote.filter(a => a.sexo === 'Fêmea').length;
    const pesoMedio = totalAnimais > 0 
      ? animaisDoLote.reduce((acc, a) => acc + (parseFloat(a.peso) || 0), 0) / totalAnimais 
      : 0;
    
    return {
      ...lote,
      total_animais: totalAnimais,
      total_machos: totalMachos,
      total_femeas: totalFemeas,
      peso_medio: Math.round(pesoMedio * 100) / 100
    };
  });
  
  localStorage.setItem('lotes', JSON.stringify(lotesAtualizados));
  return lotesAtualizados;
};

// Atualizar um lote específico
export const updateLoteStats = (loteCodigo) => {
  const lotes = JSON.parse(localStorage.getItem('lotes') || '[]');
  const animais = JSON.parse(localStorage.getItem('animais') || '[]');
  
  const loteIndex = lotes.findIndex(l => l.codigo === loteCodigo || l.id?.toString() === loteCodigo);
  
  if (loteIndex !== -1) {
    const animaisDoLote = animais.filter(a => a.lote === loteCodigo);
    
    const totalAnimais = animaisDoLote.length;
    const totalMachos = animaisDoLote.filter(a => a.sexo === 'Macho').length;
    const totalFemeas = animaisDoLote.filter(a => a.sexo === 'Fêmea').length;
    const pesoMedio = totalAnimais > 0 
      ? animaisDoLote.reduce((acc, a) => acc + (parseFloat(a.peso) || 0), 0) / totalAnimais 
      : 0;
    
    lotes[loteIndex] = {
      ...lotes[loteIndex],
      total_animais: totalAnimais,
      total_machos: totalMachos,
      total_femeas: totalFemeas,
      peso_medio: Math.round(pesoMedio * 100) / 100
    };
    
    localStorage.setItem('lotes', JSON.stringify(lotes));
  }
  
  return lotes;
};

// Adicionar animal nascido via reprodução
export const addAnimalFromReproducao = (reproducao, animaisExistentes) => {
  const animais = [...animaisExistentes];
  
  // Buscar mãe para obter informações
  const mae = animais.find(a => a.id === reproducao.animalId);
  
  // Criar novo animal para cada cria
  const novosAnimais = [];
  for (let i = 0; i < reproducao.criasVivas; i++) {
    const novoId = animais.length > 0 ? Math.max(...animais.map(a => a.id)) + 1 + i : 1 + i;
    
    const novoAnimal = {
      id: novoId,
      brinco: `${mae?.brinco || '000'}${reproducao.id}${i + 1}`,
      nome: `Cria de ${mae?.nome || 'Desconhecido'} ${i + 1}`,
      sexo: 'Macho',
      idade: '0 dias',
      peso: 0,
      lote: mae?.lote || '',
      status: 'Ativo',
      raca: mae?.raca || '',
      especie: mae?.especie || 'Bovino',
      dataNascimento: reproducao.dataEvento,
      brincoMae: mae?.brinco || '',
      brincoPai: reproducao.brincoPai || '',
      loteMae: mae?.lote || '',
      lotePai: '',
      observacoes: `Nascido de parto em ${reproducao.dataEvento}`,
      criado_em: new Date().toISOString(),
      partoId: reproducao.id
    };
    
    novosAnimais.push(novoAnimal);
  }
  
  // Adicionar novos animais
  const animaisAtualizados = [...animais, ...novosAnimais];
  localStorage.setItem('animais', JSON.stringify(animaisAtualizados));
  
  // Atualizar lotes
  syncLotesStats();
  
  return novosAnimais;
};

// Sincronizar estatísticas do dashboard
export const syncDashboardStats = () => {
  const animais = JSON.parse(localStorage.getItem('animais') || '[]');
  const lotes = JSON.parse(localStorage.getItem('lotes') || '[]');
  const vacinas = JSON.parse(localStorage.getItem('vacinas') || '[]');
  const pesagens = JSON.parse(localStorage.getItem('pesagens') || '[]');
  
  const stats = {
    totalAnimais: animais.length,
    animaisAtivos: animais.filter(a => a.status === 'Ativo').length,
    totalLotes: lotes.length,
    totalVacinas: vacinas.length,
    totalPesagens: pesagens.length,
    totalMachos: animais.filter(a => a.sexo === 'Macho').length,
    totalFemeas: animais.filter(a => a.sexo === 'Fêmea').length
  };
  
  localStorage.setItem('dashboardStats', JSON.stringify(stats));
  return stats;
};