import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormCard, { FormRow, FormGroup } from '../../components/forms/FormCard';

const EditarVacina = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const vacinas = JSON.parse(localStorage.getItem('vacinas') || '[]');
    const vacina = vacinas.find(v => v.id === parseInt(id));
    if (vacina) {
      setFormData(vacina);
    } else {
      navigate('/vacinas');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const vacinas = JSON.parse(localStorage.getItem('vacinas') || '[]');
    const index = vacinas.findIndex(v => v.id === parseInt(id));
    
    if (index !== -1) {
      vacinas[index] = { ...formData, updatedAt: new Date().toISOString() };
      localStorage.setItem('vacinas', JSON.stringify(vacinas));
    }
    
    navigate('/vacinas');
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
        <h2>Editar Vacina</h2>
        <p>Altere as informações da vacina</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit}>
          <FormCard title="Informações da Vacina">
            <FormRow>
              <FormGroup label="ID vacina">
                <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} />
              </FormGroup>
              <FormGroup label="Data de aplicação">
                <input type="text" name="dataAplicacao" value={formData.dataAplicacao || ''} onChange={handleChange} />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Aplicada por">
                <input type="text" name="aplicador" value={formData.aplicador || ''} onChange={handleChange} />
              </FormGroup>
              <FormGroup label="Status">
                <select name="status" value={formData.status || 'Pendente'} onChange={handleChange}>
                  <option>Aplicada</option>
                  <option>Pendente</option>
                </select>
              </FormGroup>
            </FormRow>

            <FormGroup label="Observações">
              <textarea name="observacoes" rows="3" value={formData.observacoes || ''} onChange={handleChange} />
            </FormGroup>
          </FormCard>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/vacinas')}>
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

export default EditarVacina;