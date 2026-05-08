// Verificar permissão do usuário
export const getUserPermissions = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  console.log('Usuário logado:', user); // Para debug
  
  // Se não tem usuário logado
  if (!user || !user.id) {
    return {
      role: 'guest',
      canEditAnimais: false,
      canDeleteAnimais: false,
      canEditLotes: false,
      canDeleteLotes: false,
      canEditVacinas: false,
      canDeleteVacinas: false,
      canEditReproducao: false,
      canDeleteReproducao: false,
      canEditPesagens: false,
      canDeletePesagens: false,
      canEditEstoque: false,
      canDeleteEstoque: false,
      canEditDietas: false,
      canDeleteDietas: false,
      canEditFuncionarios: false,
      canDeleteFuncionarios: false,
      canEditConfiguracoes: false
    };
  }
  
  // ADMIN ou dono da fazenda - TEM TODAS AS PERMISSÕES
  // Se o usuário não tem tipo definido, é admin
  // Se tem isOwner = true, é admin
  // Se tem tipo = 'admin', é admin
  if (!user.tipo || user.tipo === 'admin' || user.isOwner === true) {
    return {
      role: 'admin',
      canEditAnimais: true,
      canDeleteAnimais: true,
      canEditLotes: true,
      canDeleteLotes: true,
      canEditVacinas: true,
      canDeleteVacinas: true,
      canEditReproducao: true,
      canDeleteReproducao: true,
      canEditPesagens: true,
      canDeletePesagens: true,
      canEditEstoque: true,
      canDeleteEstoque: true,
      canEditDietas: true,
      canDeleteDietas: true,
      canEditFuncionarios: true,
      canDeleteFuncionarios: true,
      canEditConfiguracoes: true
    };
  }
  
  // Funcionário - usa permissões do cargo
  if (user.tipo === 'funcionario' && user.permissoes) {
    return {
      role: user.cargo || 'funcionario',
      canEditAnimais: user.permissoes?.animais?.editar || false,
      canDeleteAnimais: user.permissoes?.animais?.deletar || false,
      canEditLotes: user.permissoes?.lotes?.editar || false,
      canDeleteLotes: user.permissoes?.lotes?.deletar || false,
      canEditVacinas: user.permissoes?.vacinas?.editar || false,
      canDeleteVacinas: user.permissoes?.vacinas?.deletar || false,
      canEditReproducao: user.permissoes?.reproducao?.editar || false,
      canDeleteReproducao: user.permissoes?.reproducao?.deletar || false,
      canEditPesagens: user.permissoes?.pesagens?.editar || false,
      canDeletePesagens: user.permissoes?.pesagens?.deletar || false,
      canEditEstoque: user.permissoes?.estoque?.editar || false,
      canDeleteEstoque: user.permissoes?.estoque?.deletar || false,
      canEditDietas: user.permissoes?.dietas?.editar || false,
      canDeleteDietas: user.permissoes?.dietas?.deletar || false,
      canEditFuncionarios: user.permissoes?.funcionarios?.editar || false,
      canDeleteFuncionarios: user.permissoes?.funcionarios?.deletar || false,
      canEditConfiguracoes: user.permissoes?.configuracoes?.editar || false
    };
  }
  
  // Permissões padrão (usuário normal - tem todas)
  return {
    role: 'user',
    canEditAnimais: true,
    canDeleteAnimais: true,
    canEditLotes: true,
    canDeleteLotes: true,
    canEditVacinas: true,
    canDeleteVacinas: true,
    canEditReproducao: true,
    canDeleteReproducao: true,
    canEditPesagens: true,
    canDeletePesagens: true,
    canEditEstoque: true,
    canDeleteEstoque: true,
    canEditDietas: true,
    canDeleteDietas: true,
    canEditFuncionarios: true,
    canDeleteFuncionarios: true,
    canEditConfiguracoes: true
  };
};

// Verificar se pode editar
export const canEdit = (permissions, module) => {
  if (!permissions) return false;
  return permissions[`canEdit${module}`] || false;
};

// Verificar se pode deletar
export const canDelete = (permissions, module) => {
  if (!permissions) return false;
  return permissions[`canDelete${module}`] || false;
};

// Verificar se pode visualizar
export const canView = (permissions, module) => {
  if (!permissions) return true; // Por padrão, todos podem visualizar
  return true;
};