import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calcularGanhoDiarioEntrePesagens, formatarGanhoDiario } from '../../utils/calculosPesagem';

const NovaPesagem = () => {
  const navigate = useNavigate();
  const [animais, setAnimais] = useState([]);
  const [pesagensExistentes, setPesagensExistentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ganhoCalculado, setGanhoCalculado] = useState(null);
  const [formData, setFormData] = useState({
    animalId: '',
    animalNome: '',
    animalBrinco: '',
    dataPesagem: '',
    peso: '',
    ganhoDiario: '',
    tipo: 'Rotina',
    observacoes: ''
  });

  useEffect(() => {
    const storedAnimais = localStorage.getItem('animais');
    const storedPesagens = localStorage.getItem('pesagens');
    
    if (storedAnimais) {
      setAnimais(JSON.parse(storedAnimais));
    }
    if (storedPesagens) {
      setPesagensExistentes(JSON.parse(storedPesagens));
    }
  }, []);

  // Função para calcular ganho diário
  const calcularGanhoDiario = (animalId, pesoAtual, dataAtual, pesagens) => {
    // Filtrar pesagens do mesmo animal
    const pesagensAnimal = pesagens
      .filter(p => p.animalId === animalId)
      .sort((a, b) => {
        const dataA = a.dataPesagem.split('/').reverse().join('-');
        const dataB = b.dataPesagem.split('/').reverse().join('-');
        return new Date(dataB) - new Date(dataA);
      });
    
    if (pesagensAnimal.length === 0) return null;
    
    const ultimaPesagem = pesagensAnimal[0];
    
    // Converter datas
    const dataUltima = new Date(ultimaPesagem.dataPesagem.split('/').reverse().join('-'));
    const dataAtualObj = new Date(dataAtual);
    
    const diffDias = Math.floor((dataAtualObj - dataUltima) / (1000 * 60 * 60 * 24));
    
    if (diffDias <= 0) return null;
    
    const diffPeso = (pesoAtual - ultimaPesagem.peso) * 1000;
    const ganhoDiario = diffPeso / diffDias;
    
    return Math.round(ganhoDiario * 100) / 100;
  };

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
      setGanhoCalculado(null);
    } else if (name === 'dataPesagem' || name === 'peso') {
      setFormData({ ...formData, [name]: value });
      
      if (formData.animalId && formData.dataPesagem && value) {
        const dataAtual = name === 'dataPesagem' ? value : formData.dataPesagem;
        const pesoAtual = name === 'peso' ? parseFloat(value) : parseFloat(formData.peso);
        
        if (dataAtual && pesoAtual) {
          const ganho = calcularGanhoDiario(
            parseInt(formData.animalId), 
            pesoAtual, 
            dataAtual, 
            pesagensExistentes
          );
          setGanhoCalculado(ganho);
          
          if (ganho !== null) {
            setFormData(prev => ({ ...prev, ganhoDiario: ganho.toString() }));
          } else {
            setFormData(prev => ({ ...prev, ganhoDiario: '' }));
          }
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const pesagens = JSON.parse(localStorage.getItem('pesagens') || '[]');
    const animaisAtuais = JSON.parse(localStorage.getItem('animais') || '[]');
    
    const newId = pesagens.length > 0 ? Math.max(...pesagens.map(p => p.id)) + 1 : 1;
    
    const novaPesagem = {
      id: newId,
      ...formData,
      peso: parseFloat(formData.peso),
      ganhoDiario: formData.ganhoDiario ? parseFloat(formData.ganhoDiario) : null,
      createdAt: new Date().toISOString()
    };
    
    pesagens.push(novaPesagem);
    localStorage.setItem('pesagens', JSON.stringify(pesagens));
    
    const animalIndex = animaisAtuais.findIndex(a => a.id === parseInt(formData.animalId));
    if (animalIndex !== -1) {
      animaisAtuais[animalIndex].peso = parseFloat(formData.peso);
      animaisAtuais[animalIndex].ultimaPesagem = formData.dataPesagem;
      animaisAtuais[animalIndex].ultimaPesagemId = newId;
      
      localStorage.setItem('animais', JSON.stringify(animaisAtuais));
    }
    
    setTimeout(() => {
      setLoading(false);
      navigate('/pesagens');
    }, 500);
  };

  const getUltimaPesagemInfo = () => {
    if (!formData.animalId) return null;
    
    const pesagensAnimal = pesagensExistentes
      .filter(p => p.animalId === parseInt(formData.animalId))
      .sort((a, b) => {
        const dataA = a.dataPesagem.split('/').reverse().join('-');
        const dataB = b.dataPesagem.split('/').reverse().join('-');
        return new Date(dataB) - new Date(dataA);
      });
    
    if (pesagensAnimal.length === 0) return null;
    return pesagensAnimal[0];
  };

  const ultimaPesagem = getUltimaPesagemInfo();

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
              <select name="animalId" onChange={handleChange} required>
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
              <input type="date" name="dataPesagem" onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Peso (Kg) *</label>
              <input type="number" step="0.01" name="peso" onChange={handleChange} required placeholder="Peso em quilogramas" />
            </div>
            
            <div className="form-group">
              <label>Ganho Diário (g/dia)</label>
              <input 
                type="number" 
                step="0.01" 
                name="ganhoDiario" 
                value={formData.ganhoDiario} 
                onChange={handleChange} 
                placeholder="Calculado automaticamente"
              />
              {ganhoCalculado !== null && (
                <small className="helper-text" style={{ color: ganhoCalculado < 0 ? '#e74c3c' : '#27ae60' }}>
                  {formatarGanhoDiario(ganhoCalculado)}
                </small>
              )}
            </div>
            
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" onChange={handleChange}>
                <option>Rotina</option>
                <option>Pós-parto</option>
                <option>Pré-venda</option>
                <option>Desmame</option>
              </select>
            </div>
            
            {ultimaPesagem && (
              <div className="form-group full-width">
                <label>Última Pesagem:</label>
                <div style={{ background: '#f0f2f5', padding: '10px', borderRadius: '6px' }}>
                  <p><strong>Data:</strong> {ultimaPesagem.dataPesagem}</p>
                  <p><strong>Peso:</strong> {ultimaPesagem.peso} kg</p>
                  <p><strong>Ganho:</strong> {ultimaPesagem.ganhoDiario ? `${ultimaPesagem.ganhoDiario} g/dia` : '-'}</p>
                </div>
              </div>
            )}
            
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