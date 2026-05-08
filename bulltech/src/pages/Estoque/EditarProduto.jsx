import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditarProduto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

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

  useEffect(() => {
    const produtos = JSON.parse(localStorage.getItem('estoque') || '[]');
    const found = produtos.find(p => p.id === parseInt(id));
    if (found) {
      setFormData(found);
    } else {
      navigate('/estoque');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const produtos = JSON.parse(localStorage.getItem('estoque') || '[]');
    const index = produtos.findIndex(p => p.id === parseInt(id));
    
    if (index !== -1) {
      produtos[index] = { 
        ...formData, 
        quantidade: parseFloat(formData.quantidade),
        precoUnitario: parseFloat(formData.precoUnitario),
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem('estoque', JSON.stringify(produtos));
    }
    
    setTimeout(() => {
      setSaving(false);
      navigate('/estoque');
    }, 500);
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Editar Produto</h2>
          <p>Altere as informações do produto</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Editar Produto</h2>
        <p>Altere as informações do produto</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome do Produto *</label>
              <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Categoria *</label>
              <select name="categoria" value={formData.categoria || 'Alimentação'} onChange={handleChange}>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantidade *</label>
              <input type="number" step="0.01" name="quantidade" value={formData.quantidade || ''} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Unidade *</label>
              <select name="unidade" value={formData.unidade || 'kg'} onChange={handleChange}>
                {unidades.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Preço Unitário (R$) *</label>
              <input type="number" step="0.01" name="precoUnitario" value={formData.precoUnitario || ''} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Data de Validade</label>
              <input type="date" name="dataValidade" value={formData.dataValidade || ''} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Fornecedor</label>
              <input type="text" name="fornecedor" value={formData.fornecedor || ''} onChange={handleChange} />
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" value={formData.observacoes || ''} onChange={handleChange}></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/estoque')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarProduto;