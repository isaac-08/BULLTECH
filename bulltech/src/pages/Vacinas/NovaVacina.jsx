import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NovaVacina = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    fabricante: '',
    tipo: '',
    quantidade: '',
    dataValidade: '',
    observacoes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Salvar no localStorage de vacinas
    const vacinas = JSON.parse(localStorage.getItem('vacinas') || '[]');
    const newId = vacinas.length > 0 ? Math.max(...vacinas.map(v => v.id)) + 1 : 1;
    
    const novaVacina = {
      id: newId,
      ...formData,
      quantidade: parseInt(formData.quantidade) || 0,
      status: 'Estoque',
      createdAt: new Date().toISOString()
    };
    
    vacinas.push(novaVacina);
    localStorage.setItem('vacinas', JSON.stringify(vacinas));
    
    // ========== TAMBÉM SALVAR NO ESTOQUE ==========
    const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
    const novoIdEstoque = estoque.length > 0 ? Math.max(...estoque.map(e => e.id)) + 1 : 1;
    
    const novoItemEstoque = {
      id: novoIdEstoque,
      nome: formData.nome,
      categoria: 'Vacinas',
      quantidade: parseInt(formData.quantidade) || 0,
      unidade: 'dose',
      precoUnitario: 0,
      dataValidade: formData.dataValidade,
      fornecedor: formData.fabricante,
      observacoes: formData.observacoes,
      vacinaId: newId,
      createdAt: new Date().toISOString()
    };
    
    estoque.push(novoItemEstoque);
    localStorage.setItem('estoque', JSON.stringify(estoque));
    
    setTimeout(() => {
      setLoading(false);
      navigate('/vacinas');
    }, 500);
  };

  return (
    <>
      <div className="welcome-section">
        <h2>Nova Vacina</h2>
        <p>Cadastre uma nova vacina no estoque</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome da Vacina *</label>
              <input type="text" name="nome" onChange={handleChange} required placeholder="Ex: Febre Aftosa" />
            </div>
            
            <div className="form-group">
              <label>Fabricante</label>
              <input type="text" name="fabricante" onChange={handleChange} placeholder="Nome do fabricante" />
            </div>
            
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" onChange={handleChange}>
                <option value="">Selecione</option>
                <option>Viral</option>
                <option>Bacteriana</option>
                <option>Parasitária</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantidade (doses)</label>
              <input type="number" name="quantidade" onChange={handleChange} placeholder="Quantidade em estoque" />
            </div>
            
            <div className="form-group">
              <label>Data de Validade</label>
              <input type="date" name="dataValidade" onChange={handleChange} />
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" onChange={handleChange} placeholder="Observações adicionais..."></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/vacinas')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Cadastrar Vacina'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovaVacina;