import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pesagensAPI, animaisAPI } from '../../services/api';
import { calcularGanhoDiarioEntrePesagens } from '../../utils/calculosPesagem';

const NovaPesagem = () => {
  const navigate = useNavigate();
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pesagensExistentes, setPesagensExistentes] = useState([]);
  const [formData, setFormData] = useState({
    animal_id: '',
    animal_nome: '',
    animal_brinco: '',
    data_pesagem: '',
    peso: '',
    tipo: 'Rotina',
    observacoes: ''
  });
  const [ganhoCalculado, setGanhoCalculado] = useState(null);

  useEffect(() => {
    carregarAnimais();
  }, []);

  const carregarAnimais = async () => {
    try {
      const data = await animaisAPI.getAll();
      setAnimais(data);
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
    }
  };

  const carregarPesagensDoAnimal = async (animalId) => {
    try {
      const data = await pesagensAPI.getByAnimal(animalId);
      setPesagensExistentes(data);
    } catch (error) {
      console.error('Erro ao carregar pesagens do animal:', error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    if (name === 'animal_id') {
      const animal = animais.find(a => a.id === parseInt(value));
      setFormData({
        ...formData,
        animal_id: value,
        animal_nome: animal ? animal.nome : '',
        animal_brinco: animal ? animal.brinco : ''
      });
      if (value) {
        await carregarPesagensDoAnimal(parseInt(value));
      }
    } else if (name === 'data_pesagem' || name === 'peso') {
      setFormData({ ...formData, [name]: value });
      
      // Calcular ganho diário se tiver data e peso
      if (formData.data_pesagem && formData.peso && name === 'peso') {
        calcularGanho(formData.data_pesagem, value);
      } else if (formData.data_pesagem && formData.peso && name === 'data_pesagem') {
        calcularGanho(value, formData.peso);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calcularGanho = (data, peso) => {
    if (pesagensExistentes.length > 0) {
      const ultimaPesagem = pesagensExistentes[pesagensExistentes.length - 1];
      const ganho = calcularGanhoDiarioEntrePesagens(
        { dataPesagem: data, peso: parseFloat(peso) },
        { dataPesagem: ultimaPesagem.data_pesagem, peso: ultimaPesagem.peso }
      );
      setGanhoCalculado(ganho);
    } else {
      setGanhoCalculado(null);
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
        data_pesagem: formData.data_pesagem,
        peso: parseFloat(formData.peso),
        ganho_diario: ganhoCalculado,
        tipo: formData.tipo,
        observacoes: formData.observacoes || null
      };
      
      await pesagensAPI.create(dadosParaEnviar);
      alert('Pesagem salva com sucesso!');
      navigate('/pesagens');
    } catch (error) {
      console.error('Erro ao salvar pesagem:', error);
      alert('Erro ao salvar pesagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="welcome-section">
        <h2>Nova Pesagem</h2>
        <p>Registre uma nova pesagem de animal</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Animal *</label>
              <select name="animal_id" onChange={handleChange} required>
                <option value="">Selecione um animal</option>
                {animais.map(animal => (
                  <option key={animal.id} value={animal.id}>
                    {animal.brinco} - {animal.nome} (Peso atual: {animal.peso || '-'} kg)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Data da Pesagem *</label>
              <input type="date" name="data_pesagem" onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Peso (Kg) *</label>
              <input type="number" step="0.01" name="peso" onChange={handleChange} required placeholder="Peso em quilogramas" />
            </div>
            
            {ganhoCalculado !== null && (
              <div className="form-group">
                <label>Ganho Diário Calculado</label>
                <input type="text" value={`${ganhoCalculado} g/dia`} disabled style={{ background: '#f0f0f0' }} />
                <small>Calculado automaticamente com base na última pesagem</small>
              </div>
            )}
            
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" onChange={handleChange}>
                <option>Rotina</option>
                <option>Pós-parto</option>
                <option>Pré-venda</option>
                <option>Desmame</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" onChange={handleChange} placeholder="Observações sobre a pesagem..."></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/pesagens')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Pesagem'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovaPesagem;