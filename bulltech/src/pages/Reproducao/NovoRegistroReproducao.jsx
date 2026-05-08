import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAnimalFromReproducao } from '../../utils/syncData';

const NovoRegistroReproducao = () => {
  const navigate = useNavigate();
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    animalId: '',
    animalNome: '',
    animalBrinco: '',
    tipo: 'Cobertura',
    dataEvento: '',
    resultado: '',
    criasNascidas: 0,
    criasVivas: 0,
    brincoPai: '',
    observacoes: ''
  });

  useEffect(() => {
    const storedAnimais = localStorage.getItem('animais');
    if (storedAnimais) {
      setAnimais(JSON.parse(storedAnimais));
    }
  }, []);

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
    setLoading(true);

    const reproducoes = JSON.parse(localStorage.getItem('reproducoes') || '[]');
    const newId = reproducoes.length > 0 ? Math.max(...reproducoes.map(r => r.id)) + 1 : 1;
    
    const novoRegistro = {
      id: newId,
      ...formData,
      criasNascidas: parseInt(formData.criasNascidas) || 0,
      criasVivas: parseInt(formData.criasVivas) || 0,
      createdAt: new Date().toISOString()
    };
    
    reproducoes.push(novoRegistro);
    localStorage.setItem('reproducoes', JSON.stringify(reproducoes));
    
    // Se for um parto com crias vivas, criar os animais automaticamente
    if (formData.tipo === 'Parto' && formData.criasVivas > 0) {
      const novosAnimais = addAnimalFromReproducao(novoRegistro);
      alert(`${formData.criasVivas} novo(s) animal(is) adicionado(s) ao rebanho!`);
    }
    
    setTimeout(() => {
      setLoading(false);
      navigate('/reproducao');
    }, 500);
  };

  return (
    <>
      <div className="welcome-section">
        <h2>Novo Registro Reprodutivo</h2>
        <p>Registre um evento reprodutivo do rebanho</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Animal *</label>
              <select name="animalId" onChange={handleChange} required>
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
              <select name="tipo" onChange={handleChange} required>
                <option>Cobertura</option>
                <option>Inseminação</option>
                <option>Parto</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Data do Evento *</label>
              <input type="date" name="dataEvento" onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Resultado</label>
              <select name="resultado" onChange={handleChange}>
                <option value="">Selecione</option>
                <option>Prenha</option>
                <option>Não Prenha</option>
                <option>Sucesso</option>
                <option>Realizado</option>
                <option>Aborto</option>
              </select>
            </div>
            
            {formData.tipo === 'Parto' && (
              <>
                <div className="form-group">
                  <label>Crias Nascidas</label>
                  <input type="number" name="criasNascidas" min="0" onChange={handleChange} />
                </div>
                
                <div className="form-group">
                  <label>Crias Vivas</label>
                  <input type="number" name="criasVivas" min="0" onChange={handleChange} />
                </div>
                
                <div className="form-group">
                  <label>Brinco do Pai (opcional)</label>
                  <input type="text" name="brincoPai" onChange={handleChange} placeholder="Brinco do reprodutor" />
                </div>
              </>
            )}
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" onChange={handleChange} placeholder="Observações adicionais..."></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/reproducao')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovoRegistroReproducao;