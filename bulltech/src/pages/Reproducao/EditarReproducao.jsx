import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reproducoesAPI } from '../../services/api';

const EditarReproducao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    carregarRegistro();
  }, [id]);

  const carregarRegistro = async () => {
    try {
      setLoading(true);
      const data = await reproducoesAPI.getOne(id);
      setFormData(data);
    } catch (error) {
      console.error('Erro ao carregar registro:', error);
      navigate('/reproducao');
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
      await reproducoesAPI.update(id, formData);
      alert('Registro atualizado com sucesso!');
      navigate('/reproducao');
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      alert('Erro ao atualizar registro');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Editar Registro</h2>
          <p>Altere as informações do registro reprodutivo</p>
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
        <h2>Editar Registro</h2>
        <p>Altere as informações do registro reprodutivo</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Animal</label>
              <input type="text" value={formData.animal_nome} disabled />
            </div>
            
            <div className="form-group">
              <label>Tipo de Evento *</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                <option>Cobertura</option>
                <option>Inseminação</option>
                <option>Parto</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Data do Evento *</label>
              <input type="date" name="data_evento" value={formData.data_evento} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Resultado</label>
              <select name="resultado" value={formData.resultado || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                <option>Prenha</option>
                <option>Não Prenha</option>
                <option>Sucesso</option>
                <option>Realizado</option>
                <option>Aborto</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Crias Nascidas</label>
              <input type="number" name="crias_nascidas" min="0" value={formData.crias_nascidas || 0} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Crias Vivas</label>
              <input type="number" name="crias_vivas" min="0" value={formData.crias_vivas || 0} onChange={handleChange} />
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" value={formData.observacoes || ''} onChange={handleChange}></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/reproducao')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarReproducao;