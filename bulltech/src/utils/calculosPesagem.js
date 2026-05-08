export const calcularGanhoDiarioEntrePesagens = (pesagemAtual, pesagemAnterior) => {
  if (!pesagemAtual || !pesagemAnterior) return null;
  
  const dataAtual = new Date(pesagemAtual.dataPesagem.split('/').reverse().join('-'));
  const dataAnterior = new Date(pesagemAnterior.dataPesagem.split('/').reverse().join('-'));
  const diffDias = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));
  
  if (diffDias <= 0) return null;
  
  const diffPeso = (pesagemAtual.peso - pesagemAnterior.peso) * 1000;
  const ganhoDiario = diffPeso / diffDias;
  
  return Math.round(ganhoDiario * 100) / 100;
};

export const calcularGanhoMedioAnimal = (pesagens) => {
  if (pesagens.length < 2) return null;
  
  const pesagensOrdenadas = [...pesagens].sort((a, b) => {
    const dataA = a.dataPesagem.split('/').reverse().join('-');
    const dataB = b.dataPesagem.split('/').reverse().join('-');
    return new Date(dataA) - new Date(dataB);
  });
  
  let ganhoTotal = 0;
  let diasTotal = 0;
  
  for (let i = 1; i < pesagensOrdenadas.length; i++) {
    const dataAtual = new Date(pesagensOrdenadas[i].dataPesagem.split('/').reverse().join('-'));
    const dataAnterior = new Date(pesagensOrdenadas[i-1].dataPesagem.split('/').reverse().join('-'));
    const diffDias = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));
    const diffPeso = (pesagensOrdenadas[i].peso - pesagensOrdenadas[i-1].peso) * 1000;
    
    if (diffDias > 0) {
      ganhoTotal += diffPeso;
      diasTotal += diffDias;
    }
  }
  
  if (diasTotal === 0) return null;
  return Math.round((ganhoTotal / diasTotal) * 100) / 100;
};

export const formatarGanhoDiario = (ganho) => {
  if (ganho === null || ganho === undefined) return '-';
  if (ganho < 0) return `${Math.abs(ganho)} g/dia (perda)`;
  return `${ganho} g/dia`;
};

// Função para calcular ganho diário baseado na última pesagem
export const calcularGanhoDiario = (animalId, pesoAtual, dataAtual, pesagensExistentes) => {
  // Filtrar pesagens do mesmo animal
  const pesagensAnimal = pesagensExistentes
    .filter(p => p.animalId === animalId)
    .sort((a, b) => {
      const dataA = a.dataPesagem.split('/').reverse().join('-');
      const dataB = b.dataPesagem.split('/').reverse().join('-');
      return new Date(dataB) - new Date(dataA);
    });
  
  if (pesagensAnimal.length === 0) return null;
  
  const ultimaPesagem = pesagensAnimal[0];
  
  // Converter datas
  const dataUltima = new Date(ultimaPesagem.dataPesagem.split('/').reverse().join('-'));
  const dataAtualObj = new Date(dataAtual);
  
  const diffDias = Math.floor((dataAtualObj - dataUltima) / (1000 * 60 * 60 * 24));
  
  if (diffDias <= 0) return null;
  
  const diffPeso = (pesoAtual - ultimaPesagem.peso) * 1000;
  const ganhoDiario = diffPeso / diffDias;
  
  return Math.round(ganhoDiario * 100) / 100;
};

// Resto do código...