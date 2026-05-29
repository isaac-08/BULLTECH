import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { animaisAPI, lotesAPI } from '../../services/api';

const EditarAnimal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const especies = [
    { value: 'Bovino', label: '🐂 Bovino' },
    { value: 'Equino', label: '🐎 Equino' },
    { value: 'Suíno', label: '🐷 Suíno' },
    { value: 'Ovino', label: '🐑 Ovino' },
    { value: 'Caprino', label: '🐐 Caprino' },
    { value: 'Ave', label: '🐔 Ave' }
  ];

  const racas = {
    Bovino: [
      { value: 'Nelore', label: 'Nelore' },
      { value: 'Angus', label: 'Angus' },
      { value: 'Hereford', label: 'Hereford' },
      { value: 'Brahman', label: 'Brahman' },
      { value: 'Girolando', label: 'Girolando' },
      { value: 'Holandês', label: 'Holandês' },
      { value: 'Jersey', label: 'Jersey' },
      { value: 'Sindi', label: 'Sindi' },
      { value: 'Tabapuã', label: 'Tabapuã' },
      { value: 'Outra', label: 'Outra' }
    ],
    Equino: [
      { value: 'Puro Sangue Inglês', label: 'Puro Sangue Inglês' },
      { value: 'Quarto de Milha', label: 'Quarto de Milha' },
      { value: 'Mangalarga', label: 'Mangalarga' },
      { value: 'Campolina', label: 'Campolina' },
      { value: 'Crioulo', label: 'Crioulo' },
      { value: 'Outra', label: 'Outra' }
    ],
    Suíno: [
      { value: 'Landrace', label: 'Landrace' },
      { value: 'Large White', label: 'Large White' },
      { value: 'Duroc', label: 'Duroc' },
      { value: 'Pietrain', label: 'Pietrain' },
      { value: 'Outra', label: 'Outra' }
    ],
    Ovino: [
      { value: 'Santa Inês', label: 'Santa Inês' },
      { value: 'Dorper', label: 'Dorper' },
      { value: 'Suffolk', label: 'Suffolk' },
      { value: 'Outra', label: 'Outra' }
    ],
    Caprino: [
      { value: 'Saanen', label: 'Saanen' },
      { value: 'Anglo-Nubiana', label: 'Anglo-Nubiana' },
      { value: 'Boer', label: 'Boer' },
      { value: 'Outra', label: 'Outra' }
    ],
    Ave: [
      { value: 'Cobb', label: 'Cobb' },
      { value: 'Ross', label: 'Ross' },
      { value: 'Label Rouge', label: 'Label Rouge' },
      { value: 'Outra', label: 'Outra' }
    ]
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const lotesData = await lotesAPI.getAll();
      setLotes(lotesData);
      
      const animalData = await animaisAPI.getOne(id);
      setFormData(animalData);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar animal');
      navigate('/animais');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'especie') {
      setFormData({ 
        ...formData, 
        especie: value,
        raca: ''
      });
    } else if (name === 'data_nascimento') {
      setFormData({ ...formData, data_nascimento: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const animalAtualizado = {
        brinco: formData.brinco,
        nome: formData.nome,
        sexo: formData.sexo,
        idade: formData.idade,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        lote: formData.lote,
        status: formData.status,
        raca: formData.raca,
        especie: formData.especie,
        data_nascimento: formData.data_nascimento || null,
        observacoes: formData.observacoes
      };
      
      await animaisAPI.update(id, animalAtualizado);
      alert('Animal atualizado com sucesso!');
      navigate('/animais');
    } catch (error) {
      console.error('Erro ao atualizar animal:', error);
      alert('Erro ao atualizar animal');
    } finally {
      setSaving(false);
    }
  };

  const racasDisponiveis = formData?.especie ? racas[formData.especie] || [] : [];

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
              <label>Espécie</label>
              <select name="especie" value={formData.especie || ''} onChange={handleChange}>
                <option value="">Selecione a espécie</option>
                {especies.map(esp => (
                  <option key={esp.value} value={esp.value}>
                    {esp.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Raça</label>
              <select name="raca" value={formData.raca || ''} onChange={handleChange} disabled={!formData.especie}>
                <option value="">{formData.especie ? 'Selecione a raça' : 'Selecione a espécie primeiro'}</option>
                {racasDisponiveis.map(raca => (
                  <option key={raca.value} value={raca.value}>
                    {raca.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Data de Chegada</label>
              <input type="date" name="data_nascimento" value={formData.data_nascimento || ''} onChange={handleChange} />
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