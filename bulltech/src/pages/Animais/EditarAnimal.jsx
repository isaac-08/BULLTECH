import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { syncLotesStats } from '../../utils/syncData';

const EditarAnimal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loteOriginal, setLoteOriginal] = useState('');

  useEffect(() => {
    const storedLotes = localStorage.getItem('lotes');
    const storedAnimais = localStorage.getItem('animais');
    
    if (storedLotes) {
      setLotes(JSON.parse(storedLotes));
    }
    
    if (storedAnimais) {
      const animais = JSON.parse(storedAnimais);
      const animal = animais.find(a => a.id === parseInt(id));
      if (animal) {
        setFormData(animal);
        setLoteOriginal(animal.lote || '');
      } else {
        navigate('/animais');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const animais = JSON.parse(localStorage.getItem('animais') || '[]');
    const index = animais.findIndex(a => a.id === parseInt(id));
    
    if (index !== -1) {
      animais[index] = { 
        ...formData, 
        peso: formData.peso ? parseFloat(formData.peso) : null,
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem('animais', JSON.stringify(animais));
      
      // Sincronizar lotes (tanto o lote original quanto o novo)
      if (loteOriginal) {
        syncLotesStats();
      }
      if (formData.lote && formData.lote !== loteOriginal) {
        syncLotesStats();
      }
    }
    
    setTimeout(() => {
      setSaving(false);
      navigate('/animais');
    }, 500);
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Editar Animal</h2>
          <p>Altere as informações do animal</p>
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
        <h2>Editar Animal</h2>
        <p>Altere as informações do animal</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Brinco *</label>
              <input type="text" name="brinco" value={formData.brinco || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Nome *</label>
              <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Sexo</label>
              <select name="sexo" value={formData.sexo || 'Macho'} onChange={handleChange}>
                <option>Macho</option>
                <option>Fêmea</option>
              </select>
            </div>
            <div className="form-group">
              <label>Idade</label>
              <input type="text" name="idade" value={formData.idade || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Peso (Kg)</label>
              <input type="number" step="0.01" name="peso" value={formData.peso || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Lote</label>
              <select name="lote" value={formData.lote || ''} onChange={handleChange}>
                <option value="">Sem lote</option>
                {lotes.map(lote => (
                  <option key={lote.id} value={lote.codigo}>
                    {lote.codigo} - {lote.tipo} ({lote.total_animais || 0} animais)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Raça</label>
              <input type="text" name="raca" value={formData.raca || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Espécie</label>
              <input type="text" name="especie" value={formData.especie || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input type="date" name="dataNascimento" value={formData.dataNascimento || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status || 'Ativo'} onChange={handleChange}>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" value={formData.observacoes || ''} onChange={handleChange}></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/animais')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarAnimal;