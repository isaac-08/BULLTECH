import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lotesAPI } from '../../services/api';
import FormCard, { FormRow, FormGroup } from '../../components/forms/FormCard';

const NovoLote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    area: '',
    tipo: 'Pasto',
    total_animais: 0,
    peso_medio: 0,
    total_machos: 0,
    total_femeas: 0,
    observacoes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await lotesAPI.create(formData);
      alert('Lote cadastrado com sucesso!');
      navigate('/lotes');
    } catch (error) {
      console.error('Erro ao cadastrar lote:', error);
      alert('Erro ao cadastrar lote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="welcome-section">
        <h2>Novo Lote</h2>
        <p>Cadastre um novo lote na propriedade</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit}>
          <FormCard title="Informações do Lote">
            <FormRow>
              <FormGroup label="Código do Lote" required>
                <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required />
              </FormGroup>
              <FormGroup label="Área (m²)">
                <input type="number" name="area" value={formData.area} onChange={handleChange} />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Tipo">
                <select name="tipo" value={formData.tipo} onChange={handleChange}>
                  <option>Pasto</option>
                  <option>Confinamento</option>
                  <option>Quarentena</option>
                  <option>Recria</option>
                </select>
              </FormGroup>
            </FormRow>

            <FormGroup label="Observações">
              <textarea name="observacoes" rows="3" value={formData.observacoes} onChange={handleChange} />
            </FormGroup>
          </FormCard>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/lotes')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Cadastrar Lote'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovoLote;