import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { syncLotesStats } from '../../utils/syncData';

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
    dataNascimento: '',
    observacoes: ''
  });

  // Opções pré-definidas
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
    const storedLotes = localStorage.getItem('lotes');
    if (storedLotes) {
      setLotes(JSON.parse(storedLotes));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Se mudar a espécie, limpar a raça
    if (name === 'especie') {
      setFormData({ 
        ...formData, 
        especie: value,
        raca: '' // Limpa a raça quando muda a espécie
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const animais = JSON.parse(localStorage.getItem('animais') || '[]');
    const newId = animais.length > 0 ? Math.max(...animais.map(a => a.id)) + 1 : 1;
    
    const novoAnimal = {
      id: newId,
      ...formData,
      peso: formData.peso ? parseFloat(formData.peso) : null,
      createdAt: new Date().toISOString()
    };
    
    animais.push(novoAnimal);
    localStorage.setItem('animais', JSON.stringify(animais));
    
    // Sincronizar o lote (atualizar estatísticas)
    if (formData.lote) {
      syncLotesStats();
    }
    
    setTimeout(() => {
      setLoading(false);
      navigate('/animais');
    }, 500);
  };

  // Obter raças disponíveis baseado na espécie selecionada
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
              <input type="date" name="dataNascimento" onChange={handleChange} />
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