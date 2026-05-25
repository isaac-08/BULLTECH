import { supabase } from './supabase';

// ==================== AUTENTICAÇÃO ====================
export const authAPI = {
  register: async (email, senha, nome, fazenda) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert({
          auth_id: authData.user.id,
          nome,
          email,
          fazenda,
        });

      if (profileError) throw profileError;
      
      return { user: authData.user, profile: { nome, email, fazenda } };
    }
  },

  login: async (email, senha) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', user.id)
        .single();
      return { user, profile };
    }
    return null;
  },
};

// ==================== ANIMAIS ====================
export const animaisAPI = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const { data, error } = await supabase
      .from('animais')
      .select('*')
      .eq('usuario_id', perfil.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from('animais')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (animal) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const novoAnimal = {
      ...animal,
      usuario_id: perfil.id,
      peso: animal.peso ? parseFloat(animal.peso) : null,
    };

    const { data, error } = await supabase
      .from('animais')
      .insert([novoAnimal])
      .select();
    if (error) throw error;
    return data[0];
  },

  update: async (id, animal) => {
    const animalAtualizado = {
      ...animal,
      peso: animal.peso ? parseFloat(animal.peso) : null,
    };

    const { data, error } = await supabase
      .from('animais')
      .update(animalAtualizado)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('animais')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ==================== LOTES ====================
export const lotesAPI = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const { data, error } = await supabase
      .from('lotes')
      .select('*')
      .eq('usuario_id', perfil.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from('lotes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (lote) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const novoLote = { ...lote, usuario_id: perfil.id };

    const { data, error } = await supabase
      .from('lotes')
      .insert([novoLote])
      .select();
    if (error) throw error;
    return data[0];
  },

  update: async (id, lote) => {
    const { data, error } = await supabase
      .from('lotes')
      .update(lote)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('lotes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ==================== REPRODUÇÕES ====================
export const reproducoesAPI = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const { data, error } = await supabase
      .from('reproducoes')
      .select('*')
      .eq('usuario_id', perfil.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from('reproducoes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (reproducao) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const novaReproducao = {
      ...reproducao,
      usuario_id: perfil.id
    };

    console.log('Inserindo no Supabase:', novaReproducao);

    const { data, error } = await supabase
      .from('reproducoes')
      .insert([novaReproducao])
      .select();

    if (error) {
      console.error('Erro do Supabase:', error);
      throw error;
    }
    
    return data[0];
  },

  update: async (id, reproducao) => {
    const { data, error } = await supabase
      .from('reproducoes')
      .update(reproducao)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('reproducoes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ==================== VACINAS ====================
export const vacinasAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('vacinas_aplicadas')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from('vacinas_aplicadas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (vacina) => {
    const { data, error } = await supabase
      .from('vacinas_aplicadas')
      .insert([vacina])
      .select();
    if (error) throw error;
    return data[0];
  },

  update: async (id, vacina) => {
    const { data, error } = await supabase
      .from('vacinas_aplicadas')
      .update(vacina)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('vacinas_aplicadas')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ==================== PESAGENS ====================
export const pesagensAPI = {
  // Buscar todas as pesagens do usuário atual
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const { data, error } = await supabase
      .from('pesagens')
      .select('*')
      .eq('usuario_id', perfil.id)
      .order('data_pesagem', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Buscar uma pesagem específica
  getOne: async (id) => {
    const { data, error } = await supabase
      .from('pesagens')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Buscar pesagens de um animal específico
  getByAnimal: async (animalId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const { data, error } = await supabase
      .from('pesagens')
      .select('*')
      .eq('usuario_id', perfil.id)
      .eq('animal_id', animalId)
      .order('data_pesagem', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Criar nova pesagem
  create: async (pesagem) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const novaPesagem = {
      ...pesagem,
      usuario_id: perfil.id,
      animal_id: parseInt(pesagem.animal_id),
      peso: parseFloat(pesagem.peso)
    };

    const { data, error } = await supabase
      .from('pesagens')
      .insert([novaPesagem])
      .select();

    if (error) throw error;
    
    // Atualizar o peso do animal
    const { error: updateError } = await supabase
      .from('animais')
      .update({ peso: parseFloat(pesagem.peso) })
      .eq('id', parseInt(pesagem.animal_id));
    
    if (updateError) console.error('Erro ao atualizar peso do animal:', updateError);
    
    return data[0];
  },

  // Atualizar pesagem
  update: async (id, pesagem) => {
    const pesagemAtualizada = {
      data_pesagem: pesagem.data_pesagem,
      peso: parseFloat(pesagem.peso),
      ganho_diario: pesagem.ganho_diario ? parseFloat(pesagem.ganho_diario) : null,
      tipo: pesagem.tipo,
      observacoes: pesagem.observacoes
    };

    // Buscar a pesagem antiga para saber o animal_id
    const pesagemAntiga = await pesagensAPI.getOne(id);
    
    const { data, error } = await supabase
      .from('pesagens')
      .update(pesagemAtualizada)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    // Atualizar o peso do animal
    if (pesagemAntiga && pesagemAntiga.animal_id) {
      // Buscar a última pesagem do animal
      const pesagensAnimal = await pesagensAPI.getByAnimal(pesagemAntiga.animal_id);
      const ultimaPesagem = pesagensAnimal[pesagensAnimal.length - 1];
      
      if (ultimaPesagem) {
        await supabase
          .from('animais')
          .update({ peso: ultimaPesagem.peso })
          .eq('id', pesagemAntiga.animal_id);
      }
    }
    
    return data[0];
  },

  // Deletar pesagem
  delete: async (id) => {
    // Buscar a pesagem para saber o animal_id
    const pesagem = await pesagensAPI.getOne(id);
    const animalId = pesagem?.animal_id;
    
    const { error } = await supabase
      .from('pesagens')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Atualizar o peso do animal com a última pesagem restante
    if (animalId) {
      const pesagensRestantes = await pesagensAPI.getByAnimal(animalId);
      const ultimaPesagem = pesagensRestantes[pesagensRestantes.length - 1];
      
      await supabase
        .from('animais')
        .update({ peso: ultimaPesagem?.peso || null })
        .eq('id', animalId);
    }
  },
};

// ==================== ESTOQUE ====================
export const estoqueAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('estoque')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from('estoque')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (produto) => {
    const { data, error } = await supabase
      .from('estoque')
      .insert([produto])
      .select();
    if (error) throw error;
    return data[0];
  },

  update: async (id, produto) => {
    const { data, error } = await supabase
      .from('estoque')
      .update(produto)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('estoque')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ==================== DIETAS ====================
export const dietasAPI = {
  // Buscar todas as dietas do usuário
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const { data, error } = await supabase
      .from('dietas')
      .select('*')
      .eq('usuario_id', perfil.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Buscar uma dieta específica
  getOne: async (id) => {
    const { data, error } = await supabase
      .from('dietas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Buscar dieta com seus alimentos e animais
  getDietaCompleta: async (id) => {
    // Buscar dieta
    const { data: dieta, error: dietaError } = await supabase
      .from('dietas')
      .select('*')
      .eq('id', id)
      .single();
    if (dietaError) throw dietaError;

    // Buscar alimentos da dieta
    const { data: alimentos, error: alimentosError } = await supabase
      .from('dieta_alimentos')
      .select('*, estoque(*)')
      .eq('dieta_id', id);
    if (alimentosError) throw alimentosError;

    // Buscar animais da dieta
    const { data: animais, error: animaisError } = await supabase
      .from('dieta_animais')
      .select('*, animais(*)')
      .eq('dieta_id', id);
    if (animaisError) throw animaisError;

    return {
      ...dieta,
      alimentos: alimentos || [],
      animais: animais || []
    };
  },

  // Criar nova dieta
  create: async (dieta) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const novaDieta = {
      usuario_id: perfil.id,
      nome: dieta.nome,
      tipo: dieta.tipo,
      frequencia: dieta.frequencia,
      observacoes: dieta.observacoes || null
    };

    const { data, error } = await supabase
      .from('dietas')
      .insert([novaDieta])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Criar dieta com alimentos e animais
  createCompleta: async (dieta) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    // 1. Inserir a dieta
    const { data: novaDieta, error: dietaError } = await supabase
      .from('dietas')
      .insert([{
        usuario_id: perfil.id,
        nome: dieta.nome,
        tipo: dieta.tipo,
        frequencia: dieta.frequencia,
        observacoes: dieta.observacoes || null
      }])
      .select()
      .single();

    if (dietaError) throw dietaError;

    // 2. Inserir alimentos
    if (dieta.alimentos && dieta.alimentos.length > 0) {
      const alimentosToInsert = dieta.alimentos.map(alimento => ({
        dieta_id: novaDieta.id,
        alimento_id: alimento.id,
        quantidade: parseFloat(alimento.quantidade) || 0,
        unidade: alimento.unidade
      }));

      const { error: alimentosError } = await supabase
        .from('dieta_alimentos')
        .insert(alimentosToInsert);

      if (alimentosError) throw alimentosError;
    }

    // 3. Inserir animais
    if (dieta.animais && dieta.animais.length > 0) {
      const animaisToInsert = dieta.animais.map(animal => ({
        dieta_id: novaDieta.id,
        animal_id: animal.id,
        animal_brinco: animal.brinco,
        animal_nome: animal.nome,
        data_inicio: new Date().toISOString().split('T')[0],
        status: 'Ativa'
      }));

      const { error: animaisError } = await supabase
        .from('dieta_animais')
        .insert(animaisToInsert);

      if (animaisError) throw animaisError;
    }

    return novaDieta;
  },

  // Atualizar dieta
  update: async (id, dieta) => {
    const { data, error } = await supabase
      .from('dietas')
      .update({
        nome: dieta.nome,
        tipo: dieta.tipo,
        frequencia: dieta.frequencia,
        observacoes: dieta.observacoes || null
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Deletar dieta
  delete: async (id) => {
    const { error } = await supabase
      .from('dietas')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// ==================== DIETAS POR ANIMAL (RELACIONAMENTO) ====================
export const dietasPorAnimalAPI = {
  // Adicionar animal a uma dieta
  addAnimal: async (dietaId, animalId, animalBrinco, animalNome, dataInicio = null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const novaRelacao = {
      dieta_id: dietaId,
      animal_id: animalId,
      animal_brinco: animalBrinco,
      animal_nome: animalNome,
      data_inicio: dataInicio || new Date().toISOString().split('T')[0],
      status: 'Ativa',
      usuario_id: perfil.id
    };

    const { data, error } = await supabase
      .from('dietas_por_animal')
      .insert([novaRelacao])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Buscar todos os animais de uma dieta
  getAnimaisByDieta: async (dietaId) => {
    const { data, error } = await supabase
      .from('dietas_por_animal')
      .select('*, animais(*)')
      .eq('dieta_id', dietaId)
      .eq('status', 'Ativa');

    if (error) throw error;
    return data;
  },

  // Buscar todas as dietas de um animal
  getDietasByAnimal: async (animalId) => {
    const { data, error } = await supabase
      .from('dietas_por_animal')
      .select('*, dietas(*)')
      .eq('animal_id', animalId)
      .eq('status', 'Ativa');

    if (error) throw error;
    return data;
  },

  // Remover animal de uma dieta
  removeAnimal: async (dietaId, animalId) => {
    const { error } = await supabase
      .from('dietas_por_animal')
      .delete()
      .eq('dieta_id', dietaId)
      .eq('animal_id', animalId);

    if (error) throw error;
  }
};

// ==================== FUNCIONÁRIOS ====================
export const funcionariosAPI = {
  // Buscar todos os funcionários do usuário atual
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('usuario_id', perfil.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Buscar um funcionário específico
  getOne: async (id) => {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Criar novo funcionário
  create: async (funcionario) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const novoFuncionario = {
      nome: funcionario.nome,
      email: funcionario.email,
      senha: funcionario.senha,
      cpf: funcionario.cpf || null,
      telefone: funcionario.telefone || null,
      cargo: funcionario.cargo,
      nivel_acesso: funcionario.nivel_acesso,
      salario: parseFloat(funcionario.salario) || 0,
      data_admissao: funcionario.data_admissao,
      status: funcionario.status || 'Ativo',
      observacoes: funcionario.observacoes || null,
      usuario_id: perfil.id
    };

    console.log('Inserindo funcionário no Supabase:', novoFuncionario);

    const { data, error } = await supabase
      .from('funcionarios')
      .insert([novoFuncionario])
      .select();

    if (error) {
      console.error('Erro do Supabase:', error);
      throw error;
    }
    
    return data[0];
  },

  // Atualizar funcionário
  update: async (id, funcionario) => {
    const funcionarioAtualizado = {
      nome: funcionario.nome,
      email: funcionario.email,
      cpf: funcionario.cpf || null,
      telefone: funcionario.telefone || null,
      cargo: funcionario.cargo,
      nivel_acesso: funcionario.nivel_acesso,
      salario: parseFloat(funcionario.salario) || 0,
      data_admissao: funcionario.data_admissao,
      status: funcionario.status,
      observacoes: funcionario.observacoes || null
    };

    const { data, error } = await supabase
      .from('funcionarios')
      .update(funcionarioAtualizado)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Deletar funcionário
  delete: async (id) => {
    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Autenticar funcionário (login)
  login: async (email, senha) => {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .eq('status', 'Ativo')
      .single();

    if (error) throw new Error('Email ou senha inválidos');
    return data;
  }
};