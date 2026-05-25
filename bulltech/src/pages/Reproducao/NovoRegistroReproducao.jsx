import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reproducoesAPI, animaisAPI } from '../../services/api';

const NovoRegistroReproducao = () => {
  const navigate = useNavigate();
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    animal_id: '',
    animal_nome: '',
    animal_brinco: '',
    tipo: 'Cobertura',
    data_evento: '',
    resultado: '',
    crias_nascidas: 0,
    crias_vivas: 0,
    brinco_pai: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarAnimais();
  }, []);

  const carregarAnimais = async () => {
    try {
      const animaisData = await animaisAPI.getAll();
      // Filtrar apenas fêmeas para reprodução
      const femeas = animaisData.filter(a => a.sexo === 'Fêmea');
      setAnimais(femeas);
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'animal_id') {
      const animal = animais.find(a => a.id === parseInt(value));
      setFormData({
        ...formData,
        animal_id: value,
        animal_nome: animal ? animal.nome : '',
        animal_brinco: animal ? animal.brinco : ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dadosParaEnviar = {
        animal_id: parseInt(formData.animal_id),
        animal_nome: formData.animal_nome,
        animal_brinco: formData.animal_brinco,
        tipo: formData.tipo,
        data_evento: formData.data_evento,
        resultado: formData.resultado || null,
        crias_nascidas: parseInt(formData.crias_nascidas) || 0,
        crias_vivas: parseInt(formData.crias_vivas) || 0,
        brinco_pai: formData.brinco_pai || null,
        observacoes: formData.observacoes || null
      };
      
      console.log('Enviando dados:', dadosParaEnviar);
      await reproducoesAPI.create(dadosParaEnviar);
      alert('Registro adicionado com sucesso!');
      navigate('/reproducao');
    } catch (error) {
      console.error('Erro detalhado ao salvar registro:', error);
      alert(`Erro ao salvar registro: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
              <label>Animal (Fêmea) *</label>
              <select name="animal_id" onChange={handleChange} required>
                <option value="">Selecione um animal</option>
                {animais.map(animal => (
                  <option key={animal.id} value={animal.id}>
                    {animal.brinco} - {animal.nome}
                  </option>
                ))}
              </select>
              <small className="helper-text">Apenas fêmeas podem ter registros reprodutivos</small>
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
              <input type="date" name="data_evento" onChange={handleChange} required />
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
                  <input type="number" name="crias_nascidas" min="0" onChange={handleChange} />
                </div>
                
                <div className="form-group">
                  <label>Crias Vivas</label>
                  <input type="number" name="crias_vivas" min="0" onChange={handleChange} />
                </div>
                
                <div className="form-group">
                  <label>Brinco do Pai (opcional)</label>
                  <input type="text" name="brinco_pai" onChange={handleChange} placeholder="Brinco do reprodutor" />
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