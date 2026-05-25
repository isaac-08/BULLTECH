import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vacinasAPI } from '../../services/api';
import FormCard, { FormRow, FormGroup } from '../../components/forms/FormCard';

const EditarVacina = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarVacina();
  }, [id]);

  const carregarVacina = async () => {
    try {
      setLoading(true);
      const data = await vacinasAPI.getOne(id);
      setFormData(data);
    } catch (error) {
      console.error('Erro ao carregar vacina:', error);
      navigate('/vacinas');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await vacinasAPI.update(id, formData);
      alert('Vacina atualizada com sucesso!');
      navigate('/vacinas');
    } catch (error) {
      console.error('Erro ao atualizar vacina:', error);
      alert('Erro ao atualizar vacina');
    } finally {
      setLoading(false);
    }
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
              <FormGroup label="Vacina">
                <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} />
              </FormGroup>
              <FormGroup label="Data de aplicação">
                <input type="date" name="data_aplicacao" value={formData.data_aplicacao || ''} onChange={handleChange} />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Animal">
                <input type="text" name="animal_nome" value={formData.animal_nome || ''} onChange={handleChange} />
              </FormGroup>
              <FormGroup label="Aplicada por">
                <input type="text" name="aplicador" value={formData.aplicador || ''} onChange={handleChange} />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Dose">
                <input type="text" name="dose" value={formData.dose || ''} onChange={handleChange} />
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