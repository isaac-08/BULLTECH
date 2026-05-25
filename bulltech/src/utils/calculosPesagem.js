export const calcularGanhoDiarioEntrePesagens = (pesagemAtual, pesagemAnterior) => {
  if (!pesagemAtual || !pesagemAnterior) return null;
  
  const dataAtual = new Date(pesagemAtual.data_pesagem);
  const dataAnterior = new Date(pesagemAnterior.data_pesagem);
  const diffDias = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));
  
  if (diffDias <= 0) return null;
  
  const diffPeso = (pesagemAtual.peso - pesagemAnterior.peso) * 1000;
  const ganhoDiario = diffPeso / diffDias;
  
  return Math.round(ganhoDiario * 100) / 100;
};

export const calcularGanhoMedioAnimal = (pesagens) => {
  if (!pesagens || pesagens.length < 2) return null;
  
  const pesagensOrdenadas = [...pesagens].sort((a, b) => 
    new Date(a.data_pesagem) - new Date(b.data_pesagem)
  );
  
  let ganhoTotal = 0;
  let diasTotal = 0;
  
  for (let i = 1; i < pesagensOrdenadas.length; i++) {
    const dataAtual = new Date(pesagensOrdenadas[i].data_pesagem);
    const dataAnterior = new Date(pesagensOrdenadas[i-1].data_pesagem);
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