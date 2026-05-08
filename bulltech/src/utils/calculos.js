// Função para calcular idade a partir da data de nascimento
export const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return '';
  
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  
  let idadeAnos = hoje.getFullYear() - nascimento.getFullYear();
  let idadeMeses = hoje.getMonth() - nascimento.getMonth();
  
  // Ajusta se ainda não fez aniversário no ano atual
  if (idadeMeses < 0 || (idadeMeses === 0 && hoje.getDate() < nascimento.getDate())) {
    idadeAnos--;
    idadeMeses += 12;
  }
  
  // Calcula dias para maior precisão
  const diffTime = Math.abs(hoje - nascimento);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const idadeMesesTotal = Math.floor(diffDays / 30);
  
  if (idadeAnos >= 1) {
    // Se tem 1 ano ou mais, mostra em anos
    const mesesRestantes = idadeMeses % 12;
    if (mesesRestantes > 0) {
      return `${idadeAnos} ano${idadeAnos > 1 ? 's' : ''} e ${mesesRestantes} mes${mesesRestantes > 1 ? 'es' : ''}`;
    }
    return `${idadeAnos} ano${idadeAnos > 1 ? 's' : ''}`;
  } else if (idadeMesesTotal >= 1) {
    // Se tem menos de 1 ano, mostra em meses
    return `${idadeMesesTotal} mes${idadeMesesTotal > 1 ? 'es' : ''}`;
  } else {
    // Se tem menos de 1 mês, mostra em dias
    return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  }
};

// Função para calcular apenas meses (para animais jovens)
export const calcularMeses = (dataNascimento) => {
  if (!dataNascimento) return 0;
  
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  
  const diffTime = Math.abs(hoje - nascimento);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.floor(diffDays / 30);
};