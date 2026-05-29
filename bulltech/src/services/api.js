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
      usuario_id: perfil.id,
      animal_id: parseInt(reproducao.animal_id),
      crias_nascidas: parseInt(reproducao.crias_nascidas) || 0,
      crias_vivas: parseInt(reproducao.crias_vivas) || 0
    };

    const { data, error } = await supabase
      .from('reproducoes')
      .insert([novaReproducao])
      .select();

    if (error) throw error;
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const { data, error } = await supabase
      .from('vacinas_aplicadas')
      .select('*')
      .eq('usuario_id', perfil.id)
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const novaVacina = {
      ...vacina,
      usuario_id: perfil.id,
      animal_id: vacina.animal_id || null
    };

    const { data, error } = await supabase
      .from('vacinas_aplicadas')
      .insert([novaVacina])
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
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from('pesagens')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

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
    return data[0];
  },

  update: async (id, pesagem) => {
    const pesagemAtualizada = {
      data_pesagem: pesagem.data_pesagem,
      peso: parseFloat(pesagem.peso),
      ganho_diario: pesagem.ganho_diario ? parseFloat(pesagem.ganho_diario) : null,
      tipo: pesagem.tipo,
      observacoes: pesagem.observacoes
    };

    const { data, error } = await supabase
      .from('pesagens')
      .update(pesagemAtualizada)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('pesagens')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ==================== ESTOQUE ====================
export const estoqueAPI = {
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
      .from('estoque')
      .select('*')
      .eq('usuario_id', perfil.id)
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!perfil) throw new Error('Perfil não encontrado');

    const novoProduto = {
      nome: produto.nome,
      categoria: produto.categoria,
      quantidade: parseFloat(produto.quantidade) || 0,
      unidade: produto.unidade,
      preco_unitario: produto.precoUnitario ? parseFloat(produto.precoUnitario) : 0,
      data_validade: produto.dataValidade || null,
      fornecedor: produto.fornecedor || null,
      observacoes: produto.observacoes || null,
      usuario_id: perfil.id
    };

    const { data, error } = await supabase
      .from('estoque')
      .insert([novoProduto])
      .select();

    if (error) throw error;
    return data[0];
  },

  update: async (id, produto) => {
    const produtoAtualizado = {
      nome: produto.nome,
      categoria: produto.categoria,
      quantidade: parseFloat(produto.quantidade) || 0,
      unidade: produto.unidade,
      preco_unitario: produto.precoUnitario ? parseFloat(produto.precoUnitario) : 0,
      data_validade: produto.dataValidade || null,
      fornecedor: produto.fornecedor || null,
      observacoes: produto.observacoes || null
    };

    const { data, error } = await supabase
      .from('estoque')
      .update(produtoAtualizado)
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

  getOne: async (id) => {
    const { data, error } = await supabase
      .from('dietas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

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
      ...dieta,
      usuario_id: perfil.id,
      quantidade: parseFloat(dieta.quantidade) || 0
    };

    const { data, error } = await supabase
      .from('dietas')
      .insert([novaDieta])
      .select();
    if (error) throw error;
    return data[0];
  },

  update: async (id, dieta) => {
    const { data, error } = await supabase
      .from('dietas')
      .update(dieta)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('dietas')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ==================== FUNCIONÁRIOS ====================
export const funcionariosAPI = {
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

  getOne: async (id) => {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

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
      ...funcionario,
      usuario_id: perfil.id,
      salario: parseFloat(funcionario.salario) || 0
    };

    const { data, error } = await supabase
      .from('funcionarios')
      .insert([novoFuncionario])
      .select();
    if (error) throw error;
    return data[0];
  },

  update: async (id, funcionario) => {
    const { data, error } = await supabase
      .from('funcionarios')
      .update(funcionario)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};