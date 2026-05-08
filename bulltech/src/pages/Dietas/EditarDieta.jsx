import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditarDieta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const tipos = ['Concentrado', 'Suplemento', 'Volumoso', 'Pastagem'];
  const unidades = ['kg', 'g', 'tonelada', 'litro', 'ml', 'saco', 'fardo'];
  const frequencias = ['Diário', '2x ao dia', '3x ao dia', 'Semanal', 'A cada 15 dias', 'Mensal'];

  useEffect(() => {
    const dietas = JSON.parse(localStorage.getItem('dietas') || '[]');
    const found = dietas.find(d => d.id === parseInt(id));
    if (found) {
      setFormData(found);
    } else {
      navigate('/dietas');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const dietas = JSON.parse(localStorage.getItem('dietas') || '[]');
    const index = dietas.findIndex(d => d.id === parseInt(id));
    
    if (index !== -1) {
      dietas[index] = { 
        ...formData, 
        quantidade: parseFloat(formData.quantidade),
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem('dietas', JSON.stringify(dietas));
    }
    
    setTimeout(() => {
      setSaving(false);
      navigate('/dietas');
    }, 500);
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Editar Dieta</h2>
          <p>Altere as informações da dieta</p>
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
        <h2>Editar Dieta</h2>
        <p>Altere as informações da dieta</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome da Dieta *</label>
              <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Tipo *</label>
              <select name="tipo" value={formData.tipo || 'Concentrado'} onChange={handleChange}>
                {tipos.map(t => (
                  <option key={t} value={t}>{t}</option>
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
                {unidades.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Frequência *</label>
              <select name="frequencia" value={formData.frequencia || 'Diário'} onChange={handleChange}>
                {frequencias.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Animais</label>
              <input type="text" name="animais" value={formData.animais || ''} onChange={handleChange} />
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" value={formData.observacoes || ''} onChange={handleChange}></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/dietas')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarDieta;