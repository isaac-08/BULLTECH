import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calcularGanhoDiario, formatarGanhoDiario } from '../../utils/calculosPesagem';

const EditarPesagem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [animais, setAnimais] = useState([]);
  const [pesagensExistentes, setPesagensExistentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ganhoCalculado, setGanhoCalculado] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const storedAnimais = localStorage.getItem('animais');
    const storedPesagens = localStorage.getItem('pesagens');
    
    if (storedAnimais) {
      setAnimais(JSON.parse(storedAnimais));
    }
    if (storedPesagens) {
      const pesagens = JSON.parse(storedPesagens);
      setPesagensExistentes(pesagens);
      
      const found = pesagens.find(p => p.id === parseInt(id));
      if (found) {
        setFormData(found);
      } else {
        navigate('/pesagens');
      }
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
    } else if (name === 'dataPesagem' || name === 'peso') {
      setFormData({ ...formData, [name]: value });
      
      // Calcular ganho diário automaticamente (excluindo a pesagem atual)
      if (formData.animalId && formData.dataPesagem && value) {
        const dataAtual = name === 'dataPesagem' ? value : formData.dataPesagem;
        const pesoAtual = name === 'peso' ? parseFloat(value) : parseFloat(formData.peso);
        
        if (dataAtual && pesoAtual) {
          // Filtrar pesagens anteriores (excluindo a atual)
          const outrasPesagens = pesagensExistentes.filter(p => p.id !== parseInt(id));
          
          const ganho = calcularGanhoDiario(
            parseInt(formData.animalId), 
            pesoAtual, 
            dataAtual, 
            outrasPesagens
          );
          setGanhoCalculado(ganho);
          
          if (ganho !== null) {
            setFormData(prev => ({ ...prev, ganhoDiario: ganho.toString() }));
          }
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const pesagens = JSON.parse(localStorage.getItem('pesagens') || '[]');
    const index = pesagens.findIndex(p => p.id === parseInt(id));
    
    if (index !== -1) {
      pesagens[index] = { 
        ...formData, 
        peso: parseFloat(formData.peso),
        ganhoDiario: formData.ganhoDiario ? parseFloat(formData.ganhoDiario) : null,
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem('pesagens', JSON.stringify(pesagens));
    }
    
    setTimeout(() => {
      setSaving(false);
      navigate('/pesagens');
    }, 500);
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Editar Pesagem</h2>
          <p>Altere as informações da pesagem</p>
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

  // Obter informações da última pesagem anterior
  const getUltimaPesagemInfo = () => {
    const pesagensAnimal = pesagensExistentes
      .filter(p => p.animalId === parseInt(formData.animalId) && p.id !== parseInt(id))
      .sort((a, b) => new Date(b.dataPesagem) - new Date(a.dataPesagem));
    
    if (pesagensAnimal.length === 0) return null;
    return pesagensAnimal[0];
  };

  const ultimaPesagem = getUltimaPesagemInfo();

  return (
    <>
      <div className="welcome-section">
        <h2>Editar Pesagem</h2>
        <p>Altere as informações da pesagem</p>
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
              <label>Data da Pesagem *</label>
              <input type="date" name="dataPesagem" value={formData.dataPesagem} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Peso (Kg) *</label>
              <input type="number" step="0.01" name="peso" value={formData.peso} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Ganho Diário (g/dia)</label>
              <input 
                type="number" 
                step="0.01" 
                name="ganhoDiario" 
                value={formData.ganhoDiario || ''} 
                onChange={handleChange} 
              />
              {ganhoCalculado !== null && (
                <small className="helper-text" style={{ color: ganhoCalculado < 0 ? '#e74c3c' : '#27ae60' }}>
                  {formatarGanhoDiario(ganhoCalculado)}
                </small>
              )}
            </div>
            
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" value={formData.tipo || 'Rotina'} onChange={handleChange}>
                <option>Rotina</option>
                <option>Pós-parto</option>
                <option>Pré-venda</option>
                <option>Desmame</option>
              </select>
            </div>
            
            {ultimaPesagem && (
              <div className="form-group full-width">
                <label>Última Pesagem Anterior:</label>
                <div style={{ background: '#f0f2f5', padding: '10px', borderRadius: '6px' }}>
                  <p><strong>Data:</strong> {ultimaPesagem.dataPesagem}</p>
                  <p><strong>Peso:</strong> {ultimaPesagem.peso} kg</p>
                  <p><strong>Ganho:</strong> {ultimaPesagem.ganhoDiario ? `${ultimaPesagem.ganhoDiario} g/dia` : '-'}</p>
                </div>
              </div>
            )}
            
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" value={formData.observacoes || ''} onChange={handleChange}></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/pesagens')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarPesagem;