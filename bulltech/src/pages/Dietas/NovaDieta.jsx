import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { animaisAPI } from '../../services/api';
import iconsAcoes from '../../assets/icons/acoes';
import dietaIcon from '../../assets/icons/dietas.png';
import alimentoIcon from '../../assets/icons/alimento.png';
import animaisIcon from '../../assets/icons/animais.png';

const NovaDieta = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alimentos, setAlimentos] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [alimentosSelecionados, setAlimentosSelecionados] = useState([]);
  const [animaisSelecionados, setAnimaisSelecionados] = useState([]);
  const [searchAnimal, setSearchAnimal] = useState('');
  const [filteredAnimais, setFilteredAnimais] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Concentrado',
    frequencia: 'Diário',
    observacoes: ''
  });

  const { editar, visu, excluir } = iconsAcoes;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const { data: estoqueData, error: estoqueError } = await supabase
        .from('estoque')
        .select('*')
        .in('categoria', ['Alimentação', 'Suplementos']);
      
      if (estoqueError) throw estoqueError;
      setAlimentos(estoqueData || []);
      
      const animaisData = await animaisAPI.getAll();
      setAnimais(animaisData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    if (searchAnimal.trim() === '') {
      setFilteredAnimais([]);
      return;
    }
    
    const filtered = animais.filter(animal => 
      !animaisSelecionados.find(a => a.id === animal.id) &&
      (animal.id?.toString().includes(searchAnimal) ||
       animal.brinco?.toLowerCase().includes(searchAnimal.toLowerCase()) ||
       animal.nome?.toLowerCase().includes(searchAnimal.toLowerCase()))
    );
    setFilteredAnimais(filtered.slice(0, 10));
  }, [searchAnimal, animais, animaisSelecionados]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelecionarAlimento = async (alimentoId) => {
    const alimento = alimentos.find(a => a.id === parseInt(alimentoId));
    if (alimento && !alimentosSelecionados.find(a => a.id === alimento.id)) {
      setAlimentosSelecionados([
        ...alimentosSelecionados,
        { ...alimento, quantidade: 1 }
      ]);
    }
  };

  const handleRemoverAlimento = (alimentoId) => {
    setAlimentosSelecionados(alimentosSelecionados.filter(a => a.id !== alimentoId));
  };

  const handleQuantidadeAlimentoChange = (alimentoId, quantidade) => {
    setAlimentosSelecionados(alimentosSelecionados.map(a => 
      a.id === alimentoId ? { ...a, quantidade: parseFloat(quantidade) || 0 } : a
    ));
  };

  const handleSelecionarAnimal = (animal) => {
    if (!animaisSelecionados.find(a => a.id === animal.id)) {
      setAnimaisSelecionados([...animaisSelecionados, animal]);
    }
    setSearchAnimal('');
    setFilteredAnimais([]);
  };

  const handleRemoverAnimal = (animalId) => {
    setAnimaisSelecionados(animaisSelecionados.filter(a => a.id !== animalId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (alimentosSelecionados.length === 0) {
      alert('⚠️ Selecione pelo menos um alimento para esta dieta!');
      return;
    }
    
    if (animaisSelecionados.length === 0) {
      alert('⚠️ Selecione pelo menos um animal para esta dieta!');
      return;
    }
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: perfil } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!perfil) throw new Error('Perfil não encontrado');

      const { data: novaDieta, error: dietaError } = await supabase
        .from('dietas')
        .insert([{
          usuario_id: perfil.id,
          nome: formData.nome,
          tipo: formData.tipo,
          frequencia: formData.frequencia,
          observacoes: formData.observacoes || null
        }])
        .select()
        .single();

      if (dietaError) throw dietaError;

      if (alimentosSelecionados.length > 0) {
        const alimentosToInsert = alimentosSelecionados.map(alimento => ({
          dieta_id: novaDieta.id,
          alimento_id: alimento.id,
          quantidade: alimento.quantidade,
          unidade: alimento.unidade
        }));

        const { error: alimentosError } = await supabase
          .from('dieta_alimentos')
          .insert(alimentosToInsert);

        if (alimentosError) throw alimentosError;
      }

      if (animaisSelecionados.length > 0) {
        const animaisToInsert = animaisSelecionados.map(animal => ({
          dieta_id: novaDieta.id,
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

      alert(`✅ Dieta "${formData.nome}" criada com sucesso!\n📦 ${alimentosSelecionados.length} alimento(s)\n🐄 ${animaisSelecionados.length} animal(is)`);
      navigate('/dietas');
    } catch (error) {
      console.error('Erro ao cadastrar dieta:', error);
      alert('Erro ao cadastrar dieta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tipos = ['Concentrado', 'Suplemento', 'Volumoso', 'Pastagem'];
  const frequencias = ['Diário', '2x ao dia', '3x ao dia', 'Semanal', 'A cada 15 dias', 'Mensal'];

  return (
    <>
      <div className="welcome-section">
        <h2>
          <img src={dietaIcon} alt="Nova Dieta" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Nova Dieta
        </h2>
        <p>Cadastre uma nova dieta para os animais</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome da Dieta *</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Ex: Ração de Crescimento" />
            </div>
            
            <div className="form-group">
              <label>Tipo *</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                {tipos.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Frequência *</label>
              <select name="frequencia" value={formData.frequencia} onChange={handleChange}>
                {frequencias.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Seção de Alimentos */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={alimentoIcon} alt="Alimentos" className="icon icon-sm" />
              Alimentos da Dieta
            </label>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>Selecione os alimentos e defina as quantidades</p>
            
            <div style={{ marginTop: '10px' }}>
              <select onChange={(e) => handleSelecionarAlimento(e.target.value)} value="" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="">Selecione um alimento</option>
                {alimentos.map(alimento => (
                  <option key={alimento.id} value={alimento.id}>
                    {alimento.nome} - Disponível: {alimento.quantidade} {alimento.unidade}
                  </option>
                ))}
              </select>
            </div>

            {alimentosSelecionados.length > 0 && (
              <div style={{ marginTop: '15px', background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                <label style={{ fontWeight: 'bold' }}>Alimentos selecionados:</label>
                {alimentosSelecionados.map(alimento => (
                  <div key={alimento.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', background: 'white', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ flex: 2 }}>{alimento.nome}</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={alimento.quantidade} 
                      onChange={(e) => handleQuantidadeAlimentoChange(alimento.id, e.target.value)}
                      style={{ width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid #ddd', textAlign: 'center' }}
                    />
                    <span>{alimento.unidade}</span>
                    <button type="button" onClick={() => handleRemoverAlimento(alimento.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '18px' }}>✖</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção de Animais */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={animaisIcon} alt="Animais" className="icon icon-sm" />
              Animais que receberão a dieta
            </label>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>{animaisSelecionados.length} animal(is) selecionado(s)</p>
            
            <div style={{ marginTop: '10px' }}>
              <input 
                type="text"
                placeholder="Buscar animal por ID, Brinco ou Nome..."
                value={searchAnimal}
                onChange={(e) => setSearchAnimal(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
              />
              
              {filteredAnimais.length > 0 && (
                <div style={{ marginTop: '10px', border: '1px solid #ddd', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredAnimais.map(animal => (
                    <div key={animal.id} onClick={() => handleSelecionarAnimal(animal)} style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                      <strong>#{animal.id}</strong> - {animal.brinco} - {animal.nome}
                      {animal.peso && <span style={{ color: '#666', marginLeft: '10px' }}>🎯 {animal.peso} kg</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {animaisSelecionados.length > 0 && (
              <div style={{ marginTop: '15px', background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {animaisSelecionados.map(animal => (
                    <div key={animal.id} style={{ background: 'white', padding: '5px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #ddd' }}>
                      <span>{animal.brinco} - {animal.nome}</span>
                      <button type="button" onClick={() => handleRemoverAnimal(animal.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '16px' }}>✖</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group full-width">
            <label>Observações</label>
            <textarea name="observacoes" rows="3" value={formData.observacoes} onChange={handleChange} placeholder="Observações sobre a dieta..."></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/dietas')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Dieta'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovaDieta;