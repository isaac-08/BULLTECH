import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animaisAPI, lotesAPI } from '../../services/api';

const NovoAnimal = () => {
  const navigate = useNavigate();
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brinco: '',
    nome: '',
    sexo: 'Macho',
    idade: '',
    peso: '',
    lote: '',
    status: 'Ativo',
    raca: '',
    especie: '',
    data_nascimento: '',
    observacoes: ''
  });

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
    carregarLotes();
  }, []);

  const carregarLotes = async () => {
    try {
      const data = await lotesAPI.getAll();
      setLotes(data);
    } catch (error) {
      console.error('Erro ao carregar lotes:', error);
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
    setLoading(true);

    try {
      const animalParaEnviar = {
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
      
      console.log('Enviando animal:', animalParaEnviar);
      await animaisAPI.create(animalParaEnviar);
      alert('Animal cadastrado com sucesso!');
      navigate('/animais');
    } catch (error) {
      console.error('Erro detalhado ao cadastrar animal:', error);
      alert(`Erro ao cadastrar animal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const racasDisponiveis = formData.especie ? racas[formData.especie] || [] : [];

  return (
    <>
      <div className="welcome-section">
        <h2>Novo Animal</h2>
        <p>Cadastre um novo animal na fazenda</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Brinco *</label>
              <input type="text" name="brinco" onChange={handleChange} required placeholder="Ex: 001" />
            </div>
            <div className="form-group">
              <label>Nome *</label>
              <input type="text" name="nome" onChange={handleChange} required placeholder="Ex: Mimosa" />
            </div>
            <div className="form-group">
              <label>Sexo</label>
              <select name="sexo" onChange={handleChange}>
                <option>Macho</option>
                <option>Fêmea</option>
              </select>
            </div>
            <div className="form-group">
              <label>Idade</label>
              <input type="text" name="idade" onChange={handleChange} placeholder="Ex: 2 anos" />
            </div>
            <div className="form-group">
              <label>Peso (Kg)</label>
              <input type="number" step="0.01" name="peso" onChange={handleChange} placeholder="Ex: 450.50" />
            </div>
            <div className="form-group">
              <label>Lote</label>
              <select name="lote" onChange={handleChange}>
                <option value="">Selecione um lote</option>
                {lotes.map(lote => (
                  <option key={lote.id} value={lote.codigo}>
                    {lote.codigo} - {lote.tipo} ({lote.total_animais || 0} animais)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Espécie</label>
              <select name="especie" value={formData.especie} onChange={handleChange}>
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
              <select name="raca" value={formData.raca} onChange={handleChange} disabled={!formData.especie}>
                <option value="">{formData.especie ? 'Selecione a raça' : 'Selecione a espécie primeiro'}</option>
                {racasDisponiveis.map(raca => (
                  <option key={raca.value} value={raca.value}>
                    {raca.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input type="date" name="data_nascimento" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" onChange={handleChange}>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Observações</label>
              <textarea name="observacoes" rows="3" onChange={handleChange} placeholder="Observações adicionais sobre o animal..."></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/animais')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Cadastrar Animal'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovoAnimal;