import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { animaisAPI } from '../../services/api';
import iconsAcoes from '../../assets/icons/acoes';
import dietaIcon from '../../assets/icons/dietas.png';
import animaisIcon from '../../assets/icons/animais.png';

const EditarDieta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [animaisDisponiveis, setAnimaisDisponiveis] = useState([]);
  const [animaisSelecionados, setAnimaisSelecionados] = useState([]);
  const [searchAnimal, setSearchAnimal] = useState('');
  const [filteredAnimais, setFilteredAnimais] = useState([]);

  const { editar, visu, excluir } = iconsAcoes;

  const tipos = ['Concentrado', 'Suplemento', 'Volumoso', 'Pastagem'];
  const frequencias = ['Diário', '2x ao dia', '3x ao dia', 'Semanal', 'A cada 15 dias', 'Mensal'];

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const { data: dietaData, error: dietaError } = await supabase
        .from('dietas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (dietaError) throw dietaError;
      setFormData(dietaData);
      
      const animais = await animaisAPI.getAll();
      setAnimaisDisponiveis(animais);
      
      const { data: dietaAnimais, error: dietaAnimaisError } = await supabase
        .from('dieta_animais')
        .select('animal_id')
        .eq('dieta_id', id);
      
      if (!dietaAnimaisError && dietaAnimais) {
        const idsSelecionados = dietaAnimais.map(item => item.animal_id);
        const selecionados = animais.filter(a => idsSelecionados.includes(a.id));
        setAnimaisSelecionados(selecionados);
      }
    } catch (error) {
      console.error('Erro ao carregar dieta:', error);
      navigate('/dietas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchAnimal.trim() === '') {
      setFilteredAnimais([]);
      return;
    }
    
    const filtered = animaisDisponiveis.filter(animal => 
      !animaisSelecionados.find(a => a.id === animal.id) &&
      (animal.id?.toString().includes(searchAnimal) ||
       animal.brinco?.toLowerCase().includes(searchAnimal.toLowerCase()) ||
       animal.nome?.toLowerCase().includes(searchAnimal.toLowerCase()))
    );
    setFilteredAnimais(filtered.slice(0, 10));
  }, [searchAnimal, animaisDisponiveis, animaisSelecionados]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelecionarAnimal = (animal) => {
    if (!animaisSelecionados.find(a => a.id === animal.id)) {
      const novosSelecionados = [...animaisSelecionados, animal];
      setAnimaisSelecionados(novosSelecionados);
    }
    setSearchAnimal('');
    setFilteredAnimais([]);
  };

  const handleRemoverAnimal = (animalId) => {
    setAnimaisSelecionados(animaisSelecionados.filter(a => a.id !== animalId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('dietas')
        .update({
          nome: formData.nome,
          tipo: formData.tipo,
          frequencia: formData.frequencia,
          observacoes: formData.observacoes || null
        })
        .eq('id', id);
      
      if (error) throw error;

      // Remover todos os animais antigos
      await supabase.from('dieta_animais').delete().eq('dieta_id', id);
      
      // Inserir novos animais
      if (animaisSelecionados.length > 0) {
        const animaisToInsert = animaisSelecionados.map(animal => ({
          dieta_id: parseInt(id),
          animal_id: animal.id,
          animal_brinco: animal.brinco,
          animal_nome: animal.nome,
          data_inicio: new Date().toISOString().split('T')[0],
          status: 'Ativa'
        }));

        const { error: animaisError } = await supabase
          .from('dieta_animais')
          .insert(animaisToInsert);

        if (animaisError) throw animaisError;
      }

      alert('Dieta atualizada com sucesso!');
      navigate('/dietas');
    } catch (error) {
      console.error('Erro ao atualizar dieta:', error);
      alert('Erro ao atualizar dieta');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Editar Dieta</h2>
          <p>Altere as informações da dieta</p>
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
        <h2>
          <img src={dietaIcon} alt="Editar Dieta" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Editar Dieta
        </h2>
        <p>Altere as informações da dieta</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome da Dieta *</label>
              <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Tipo *</label>
              <select name="tipo" value={formData.tipo || 'Concentrado'} onChange={handleChange}>
                {tipos.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Frequência *</label>
              <select name="frequencia" value={formData.frequencia || 'Diário'} onChange={handleChange}>
                {frequencias.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SELEÇÃO DE ANIMAIS */}
          <div className="form-group full-width" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <img src={animaisIcon} alt="Animais" className="icon icon-sm" />
              Animais que recebem esta Dieta
            </label>
            
            <div style={{ marginBottom: '15px' }}>
              <input 
                type="text"
                placeholder="Buscar animal por ID, Brinco ou Nome para adicionar..."
                value={searchAnimal}
                onChange={(e) => setSearchAnimal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              
              {filteredAnimais.length > 0 && (
                <div style={{
                  marginTop: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  background: 'white'
                }}>
                  {filteredAnimais.map(animal => (
                    <div
                      key={animal.id}
                      onClick={() => handleSelecionarAnimal(animal)}
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      <strong>#{animal.id}</strong> - {animal.brinco} - {animal.nome}
                      {animal.peso && <span style={{ color: '#666', marginLeft: '10px' }}>🎯 {animal.peso} kg</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {animaisSelecionados.length > 0 && (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: '#f9f9f9',
                padding: '10px',
                marginBottom: '15px'
              }}>
                <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>
                  ✅ {animaisSelecionados.length} animal(is) selecionado(s):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {animaisSelecionados.map(animal => (
                    <div
                      key={animal.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#e8f5e9',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    >
                      <span>{animal.brinco} - {animal.nome}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoverAnimal(animal.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group full-width">
            <label>Observações</label>
            <textarea name="observacoes" rows="3" value={formData.observacoes || ''} onChange={handleChange}></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/dietas')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarDieta;