import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const TesteConexao = () => {
  const [resultado, setResultado] = useState('');

  const testarConexao = async () => {
    setResultado('Testando conexão...');
    
    try {
      // Testar se consegue ler a tabela usuarios
      const { data, error } = await supabase
        .from('usuarios')
        .select('count');
      
      if (error) {
        setResultado(`ERRO: ${error.message}`);
        console.error(error);
      } else {
        setResultado(`✅ Conexão OK! Tabela usuarios existe.`);
      }
    } catch (err) {
      setResultado(`ERRO: ${err.message}`);
    }
  };

  const testarCadastro = async () => {
  setResultado('Testando cadastro...');
  
  // Usar timestamp + número aleatório
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const email = `teste${timestamp}${random}@teste.com`;
  const senha = '123456';
  
  console.log('Tentando cadastrar:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
  });
  
  if (error) {
    setResultado(`❌ ERRO: ${error.message}`);
    console.error('Erro detalhado:', error);
  } else {
    setResultado(`✅ Cadastro OK! Usuário: ${email}\nVerifique no Supabase Authentication.`);
    console.log('Sucesso:', data);
  }
};

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Teste de Conexão com Supabase</h2>
      <div style={{ margin: '10px 0' }}>
        <button onClick={testarConexao} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Testar Conexão
        </button>
        <button onClick={testarCadastro} style={{ padding: '8px 16px' }}>
          Testar Cadastro
        </button>
      </div>
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        background: '#f0f0f0', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap'
      }}>
        <strong>Resultado:</strong><br/>
        {resultado}
      </div>
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>URL do Supabase: {supabase.supabaseUrl}</p>
      </div>
    </div>
  );
};

export default TesteConexao;