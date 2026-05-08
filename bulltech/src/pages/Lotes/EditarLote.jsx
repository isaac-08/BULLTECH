import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormCard, { FormRow, FormGroup } from '../../components/forms/FormCard';

const EditarLote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lotes = JSON.parse(localStorage.getItem('lotes') || '[]');
    const lote = lotes.find(l => l.id === parseInt(id));
    if (lote) {
      setFormData(lote);
    } else {
      navigate('/lotes');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const lotes = JSON.parse(localStorage.getItem('lotes') || '[]');
    const index = lotes.findIndex(l => l.id === parseInt(id));
    
    if (index !== -1) {
      lotes[index] = { ...formData, updatedAt: new Date().toISOString() };
      localStorage.setItem('lotes', JSON.stringify(lotes));
    }
    
    navigate('/lotes');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
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
              <FormGroup label="Total de Animais">
                <input 
                  type="number" 
                  name="totalAnimais" 
                  value={formData.totalAnimais || 0} 
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Peso Médio (Kg)">
                <input 
                  type="number" 
                  name="pesoMedio" 
                  value={formData.pesoMedio || 0} 
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup label="Total de Machos">
                <input 
                  type="number" 
                  name="totalMachos" 
                  value={formData.totalMachos || 0} 
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Total de Fêmeas">
                <input 
                  type="number" 
                  name="totalFemeas" 
                  value={formData.totalFemeas || 0} 
                  onChange={handleChange}
                />
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
            <button type="submit" className="btn-save">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarLote;