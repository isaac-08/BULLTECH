import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AplicarVacina = () => {
  const navigate = useNavigate();
  const [animais, setAnimais] = useState([]);
  const [vacinasEstoque, setVacinasEstoque] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vacinaId: '',
    vacinaNome: '',
    animalId: '',
    animalNome: '',
    animalBrinco: '',
    dataAplicacao: '',
    aplicador: '',
    dose: '',
    observacoes: ''
  });

  useEffect(() => {
    const storedAnimais = localStorage.getItem('animais');
    const storedEstoque = localStorage.getItem('estoque');
    
    if (storedAnimais) {
      setAnimais(JSON.parse(storedAnimais));
    }
    
    // Carregar vacinas do estoque
    if (storedEstoque) {
      const vacinasEstoque = JSON.parse(storedEstoque).filter(item => item.categoria === 'Vacinas');
      setVacinasEstoque(vacinasEstoque);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'vacinaId') {
      const vacina = vacinasEstoque.find(v => v.id === parseInt(value));
      setFormData({
        ...formData,
        vacinaId: value,
        vacinaNome: vacina ? vacina.nome : ''
      });
    } else if (name === 'animalId') {
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

    // Registrar aplicação no histórico de vacinas
    const vacinasAplicadas = JSON.parse(localStorage.getItem('vacinasAplicadas') || '[]');
    const newId = vacinasAplicadas.length > 0 ? Math.max(...vacinasAplicadas.map(v => v.id)) + 1 : 1;
    
    const novaAplicacao = {
      id: newId,
      ...formData,
      status: 'Aplicada',
      createdAt: new Date().toISOString()
    };
    
    vacinasAplicadas.push(novaAplicacao);
    localStorage.setItem('vacinasAplicadas', JSON.stringify(vacinasAplicadas));
    
    // ========== SALVAR TAMBÉM NA LISTA DE VACINAS DO ANIMAL ==========
    const vacinasDoAnimal = JSON.parse(localStorage.getItem('vacinas') || '[]');
    const novaVacinaAnimal = {
      id: vacinasDoAnimal.length > 0 ? Math.max(...vacinasDoAnimal.map(v => v.id)) + 1 : 1,
      animalId: parseInt(formData.animalId),
      animalNome: formData.animalNome,
      animalBrinco: formData.animalBrinco,
      nome: formData.vacinaNome,
      dataAplicacao: formData.dataAplicacao,
      aplicador: formData.aplicador,
      dose: formData.dose,
      status: 'Aplicada',
      observacoes: formData.observacoes,
      createdAt: new Date().toISOString()
    };
    
    vacinasDoAnimal.push(novaVacinaAnimal);
    localStorage.setItem('vacinas', JSON.stringify(vacinasDoAnimal));
    
    // ATUALIZAR QUANTIDADE NO ESTOQUE (diminuir 1 dose)
    const estoque = JSON.parse(localStorage.getItem('estoque') || '[]');
    const vacinaIndex = estoque.findIndex(v => v.id === parseInt(formData.vacinaId));
    
    if (vacinaIndex !== -1 && estoque[vacinaIndex].quantidade > 0) {
      estoque[vacinaIndex].quantidade -= 1;
      localStorage.setItem('estoque', JSON.stringify(estoque));
    }
    
    setTimeout(() => {
      setLoading(false);
      navigate('/vacinas');
    }, 500);
  };

  return (
    <>
      <div className="welcome-section">
        <h2>Aplicar Vacina</h2>
        <p>Registre a aplicação de uma vacina em um animal</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Vacina *</label>
              <select name="vacinaId" onChange={handleChange} required>
                <option value="">Selecione uma vacina</option>
                {vacinasEstoque.map(vacina => (
                  <option key={vacina.id} value={vacina.id}>
                    {vacina.nome} - {vacina.quantidade} doses disponíveis
                  </option>
                ))}
              </select>
            </div>
            
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
              <label>Data de Aplicação *</label>
              <input type="date" name="dataAplicacao" onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Aplicador</label>
              <input type="text" name="aplicador" onChange={handleChange} placeholder="Nome do aplicador" />
            </div>
            
            <div className="form-group">
              <label>Dose</label>
              <select name="dose" onChange={handleChange}>
                <option value="">Selecione</option>
                <option>1° dose</option>
                <option>2° dose</option>
                <option>3° dose</option>
                <option>Reforço</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" onChange={handleChange} placeholder="Observações sobre a aplicação..."></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/vacinas')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Registrar Aplicação'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AplicarVacina;