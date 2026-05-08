import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditarReproducao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const storedAnimais = localStorage.getItem('animais');
    if (storedAnimais) {
      setAnimais(JSON.parse(storedAnimais));
    }
    
    const reproducoes = JSON.parse(localStorage.getItem('reproducoes') || '[]');
    const found = reproducoes.find(r => r.id === parseInt(id));
    if (found) {
      setFormData(found);
    } else {
      navigate('/reproducao');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'animalId') {
      const animal = animais.find(a => a.id === parseInt(value));
      setFormData({
        ...formData,
        animalId: value,
        animalNome: animal ? animal.nome : '',
        animalBrinco: animal ? animal.brinco : ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const reproducoes = JSON.parse(localStorage.getItem('reproducoes') || '[]');
    const index = reproducoes.findIndex(r => r.id === parseInt(id));
    
    if (index !== -1) {
      reproducoes[index] = { ...formData, updatedAt: new Date().toISOString() };
      localStorage.setItem('reproducoes', JSON.stringify(reproducoes));
    }
    
    setTimeout(() => {
      setSaving(false);
      navigate('/reproducao');
    }, 500);
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
              <label>Animal *</label>
              <select name="animalId" value={formData.animalId} onChange={handleChange} required>
                <option value="">Selecione um animal</option>
                {animais.map(animal => (
                  <option key={animal.id} value={animal.id}>
                    {animal.brinco} - {animal.nome}
                  </option>
                ))}
              </select>
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
              <input type="date" name="dataEvento" value={formData.dataEvento} onChange={handleChange} required />
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
              <input type="number" name="criasNascidas" min="0" value={formData.criasNascidas || 0} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Crias Vivas</label>
              <input type="number" name="criasVivas" min="0" value={formData.criasVivas || 0} onChange={handleChange} />
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