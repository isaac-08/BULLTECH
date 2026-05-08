import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const produtos = JSON.parse(localStorage.getItem('estoque') || '[]');
    const newId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
    
    const novoProduto = {
      id: newId,
      ...formData,
      quantidade: parseFloat(formData.quantidade),
      precoUnitario: parseFloat(formData.precoUnitario) || 0,
      createdAt: new Date().toISOString()
    };
    
    produtos.push(novoProduto);
    localStorage.setItem('estoque', JSON.stringify(produtos));
    
    // Se for uma vacina, também salvar na lista de vacinas
    if (formData.categoria === 'Vacinas') {
      const vacinas = JSON.parse(localStorage.getItem('vacinas') || '[]');
      const newVacinaId = vacinas.length > 0 ? Math.max(...vacinas.map(v => v.id)) + 1 : 1;
      
      const novaVacina = {
        id: newVacinaId,
        nome: formData.nome,
        fabricante: formData.fornecedor,
        tipo: '',
        quantidade: parseInt(formData.quantidade),
        dataValidade: formData.dataValidade,
        observacoes: formData.observacoes,
        status: 'Estoque',
        estoqueId: newId,
        createdAt: new Date().toISOString()
      };
      
      vacinas.push(novaVacina);
      localStorage.setItem('vacinas', JSON.stringify(vacinas));
    }
    
    setTimeout(() => {
      setLoading(false);
      navigate('/estoque');
    }, 500);
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
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovoProduto;