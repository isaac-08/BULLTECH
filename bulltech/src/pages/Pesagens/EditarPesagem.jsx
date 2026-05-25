import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pesagensAPI } from '../../services/api';

const EditarPesagem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    carregarPesagem();
  }, [id]);

  const carregarPesagem = async () => {
    try {
      setLoading(true);
      const data = await pesagensAPI.getOne(id);
      setFormData({
        ...data,
        data_pesagem: data.data_pesagem?.split('T')[0] || ''
      });
    } catch (error) {
      console.error('Erro ao carregar pesagem:', error);
      navigate('/pesagens');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await pesagensAPI.update(id, formData);
      alert('Pesagem atualizada com sucesso!');
      navigate('/pesagens');
    } catch (error) {
      console.error('Erro ao atualizar pesagem:', error);
      alert('Erro ao atualizar pesagem');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Editar Pesagem</h2>
          <p>Altere as informações da pesagem</p>
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
        <h2>Editar Pesagem</h2>
        <p>Altere as informações da pesagem</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Animal</label>
              <input type="text" value={`${formData.animal_brinco} - ${formData.animal_nome}`} disabled />
            </div>
            
            <div className="form-group">
              <label>Data da Pesagem *</label>
              <input type="date" name="data_pesagem" value={formData.data_pesagem} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Peso (Kg) *</label>
              <input type="number" step="0.01" name="peso" value={formData.peso} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Ganho Diário (g/dia)</label>
              <input type="number" step="0.01" name="ganho_diario" value={formData.ganho_diario || ''} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" value={formData.tipo || 'Rotina'} onChange={handleChange}>
                <option>Rotina</option>
                <option>Pós-parto</option>
                <option>Pré-venda</option>
                <option>Desmame</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" value={formData.observacoes || ''} onChange={handleChange}></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/pesagens')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarPesagem;