import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lotesAPI } from '../../services/api';
import FormCard, { FormRow, FormGroup } from '../../components/forms/FormCard';

const EditarLote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    carregarLote();
  }, [id]);

  const carregarLote = async () => {
    try {
      setLoading(true);
      const data = await lotesAPI.getOne(id);
      setFormData(data);
    } catch (error) {
      console.error('Erro ao carregar lote:', error);
      navigate('/lotes');
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
      await lotesAPI.update(id, formData);
      alert('Lote atualizado com sucesso!');
      navigate('/lotes');
    } catch (error) {
      console.error('Erro ao atualizar lote:', error);
      alert('Erro ao atualizar lote');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Editar Lote</h2>
          <p>Altere as informações do lote</p>
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
        <h2>Editar Lote</h2>
        <p>Altere as informações do lote</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit}>
          <FormCard title="Informações do Lote">
            <FormRow>
              <FormGroup label="Código do Lote" required>
                <input 
                  type="text" 
                  name="codigo" 
                  value={formData.codigo || ''} 
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup label="Área (m²)">
                <input 
                  type="number" 
                  name="area" 
                  value={formData.area || ''} 
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Tipo">
                <select name="tipo" value={formData.tipo || 'Pasto'} onChange={handleChange}>
                  <option>Pasto</option>
                  <option>Confinamento</option>
                  <option>Quarentena</option>
                  <option>Recria</option>
                </select>
              </FormGroup>
            </FormRow>

            <FormGroup label="Observações">
              <textarea 
                name="observacoes" 
                rows="3" 
                value={formData.observacoes || ''} 
                onChange={handleChange}
              />
            </FormGroup>
          </FormCard>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/lotes')}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarLote;