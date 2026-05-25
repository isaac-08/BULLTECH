import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { estoqueAPI } from '../../services/api';

const NovoProduto = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'Alimentação',
    quantidade: '',
    unidade: 'kg',
    precoUnitario: '',
    dataValidade: '',
    fornecedor: '',
    observacoes: ''
  });

  const categorias = [
    'Alimentação',
    'Vacinas',
    'Medicamentos',
    'Suplementos',
    'Ferramentas',
    'Equipamentos',
    'Higiene',
    'Outros'
  ];

  const unidades = [
    'kg', 'g', 'tonelada', 'litro', 'ml', 'unidade', 'dose', 'frasco', 'caixa', 'pacote'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar os dados no formato correto para o Supabase
      const produtoParaEnviar = {
        nome: formData.nome,
        categoria: formData.categoria,
        quantidade: parseFloat(formData.quantidade) || 0,
        unidade: formData.unidade,
        preco_unitario: parseFloat(formData.precoUnitario) || 0,
        data_validade: formData.dataValidade || null,
        fornecedor: formData.fornecedor || null,
        observacoes: formData.observacoes || null
      };
      
      console.log('Enviando produto:', produtoParaEnviar);
      await estoqueAPI.create(produtoParaEnviar);
      alert('Produto cadastrado com sucesso!');
      navigate('/estoque');
    } catch (error) {
      console.error('Erro detalhado ao cadastrar produto:', error);
      alert(`Erro ao cadastrar produto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="welcome-section">
        <h2>Novo Produto</h2>
        <p>Adicione um novo item ao estoque</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome do Produto *</label>
              <input type="text" name="nome" onChange={handleChange} required placeholder="Ex: Ração Premium" />
            </div>
            
            <div className="form-group">
              <label>Categoria *</label>
              <select name="categoria" onChange={handleChange} required>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantidade *</label>
              <input type="number" step="0.01" name="quantidade" onChange={handleChange} required placeholder="Ex: 500" />
            </div>
            
            <div className="form-group">
              <label>Unidade *</label>
              <select name="unidade" onChange={handleChange}>
                {unidades.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Preço Unitário (R$)</label>
              <input type="number" step="0.01" name="precoUnitario" onChange={handleChange} placeholder="Ex: 2.50" />
            </div>
            
            <div className="form-group">
              <label>Data de Validade</label>
              <input type="date" name="dataValidade" onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Fornecedor</label>
              <input type="text" name="fornecedor" onChange={handleChange} placeholder="Ex: Agropecuária Silva" />
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" onChange={handleChange} placeholder="Observações sobre o produto..."></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/estoque')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovoProduto;