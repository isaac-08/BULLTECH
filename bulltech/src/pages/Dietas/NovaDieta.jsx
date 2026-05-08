import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NovaDieta = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [animais, setAnimais] = useState([]);
  const [animaisSelecionados, setAnimaisSelecionados] = useState([]);
  const [alimentos, setAlimentos] = useState([]);
  const [alimentosSelecionados, setAlimentosSelecionados] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Concentrado',
    quantidade: '',
    unidade: 'kg',
    frequencia: 'Diário',
    observacoes: ''
  });

  useEffect(() => {
    // Carregar animais
    const storedAnimais = localStorage.getItem('animais');
    if (storedAnimais) {
      setAnimais(JSON.parse(storedAnimais));
    }
    
    // Carregar alimentos do estoque (categoria Alimentação e Suplementos)
    const storedEstoque = localStorage.getItem('estoque');
    if (storedEstoque) {
      const todosProdutos = JSON.parse(storedEstoque);
      const alimentosEstoque = todosProdutos.filter(p => 
        p.categoria === 'Alimentação' || p.categoria === 'Suplementos'
      );
      setAlimentos(alimentosEstoque);
    }
    
    // Se veio de um produto do estoque, preencher automaticamente
    if (location.state?.produto) {
      const produto = location.state.produto;
      setFormData(prev => ({
        ...prev,
        nome: produto.nome,
        tipo: produto.categoria === 'Suplementos' ? 'Suplemento' : 'Concentrado',
        quantidade: produto.quantidade,
        unidade: produto.unidade,
        observacoes: `Produto do estoque - Fornecedor: ${produto.fornecedor || 'Não informado'}`
      }));
      // Adicionar o produto aos alimentos selecionados
      setAlimentosSelecionados([produto]);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelecionarAnimal = (animalId) => {
    const animal = animais.find(a => a.id === parseInt(animalId));
    if (animal && !animaisSelecionados.find(a => a.id === animal.id)) {
      setAnimaisSelecionados([...animaisSelecionados, animal]);
    }
  };

  const handleRemoverAnimal = (animalId) => {
    setAnimaisSelecionados(animaisSelecionados.filter(a => a.id !== animalId));
  };

  const handleSelecionarAlimento = (alimentoId) => {
    const alimento = alimentos.find(a => a.id === parseInt(alimentoId));
    if (alimento && !alimentosSelecionados.find(a => a.id === alimento.id)) {
      setAlimentosSelecionados([...alimentosSelecionados, alimento]);
      // Se for o primeiro alimento, preencher o nome da dieta
      if (alimentosSelecionados.length === 0) {
        setFormData(prev => ({
          ...prev,
          nome: `Dieta com ${alimento.nome}`,
          quantidade: alimento.quantidade,
          unidade: alimento.unidade,
          tipo: alimento.categoria === 'Suplementos' ? 'Suplemento' : 'Concentrado'
        }));
      }
    }
  };

  const handleRemoverAlimento = (alimentoId) => {
    setAlimentosSelecionados(alimentosSelecionados.filter(a => a.id !== alimentoId));
    if (alimentosSelecionados.length === 1) {
      setFormData(prev => ({
        ...prev,
        nome: '',
        quantidade: '',
        tipo: 'Concentrado'
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const dietas = JSON.parse(localStorage.getItem('dietas') || '[]');
    const newId = dietas.length > 0 ? Math.max(...dietas.map(d => d.id)) + 1 : 1;
    
    const novaDieta = {
      id: newId,
      ...formData,
      quantidade: parseFloat(formData.quantidade),
      alimentosIds: alimentosSelecionados.map(a => a.id),
      alimentosNomes: alimentosSelecionados.map(a => a.nome),
      animaisIds: animaisSelecionados.map(a => a.id),
      animaisNomes: animaisSelecionados.map(a => a.nome),
      createdAt: new Date().toISOString()
    };
    
    dietas.push(novaDieta);
    localStorage.setItem('dietas', JSON.stringify(dietas));
    
    // Associar dieta a cada animal
    const dietasPorAnimal = JSON.parse(localStorage.getItem('dietasPorAnimal') || '[]');
    
    animaisSelecionados.forEach(animal => {
      const novaDietaAnimal = {
        id: dietasPorAnimal.length > 0 ? Math.max(...dietasPorAnimal.map(d => d.id), 0) + 1 : 1,
        dietaId: newId,
        animalId: animal.id,
        animalNome: animal.nome,
        animalBrinco: animal.brinco,
        nomeDieta: formData.nome,
        alimentos: alimentosSelecionados.map(a => `${a.nome} (${a.quantidade} ${a.unidade})`).join(', '),
        quantidade: formData.quantidade,
        unidade: formData.unidade,
        frequencia: formData.frequencia,
        dataInicio: new Date().toISOString().split('T')[0],
        status: 'Ativa',
        observacoes: formData.observacoes
      };
      dietasPorAnimal.push(novaDietaAnimal);
    });
    
    localStorage.setItem('dietasPorAnimal', JSON.stringify(dietasPorAnimal));
    
    setTimeout(() => {
      setLoading(false);
      navigate('/dietas');
    }, 500);
  };

  const tipos = ['Concentrado', 'Suplemento', 'Volumoso', 'Pastagem'];
  const unidades = ['kg', 'g', 'tonelada', 'litro', 'ml', 'saco', 'fardo'];
  const frequencias = ['Diário', '2x ao dia', '3x ao dia', 'Semanal', 'A cada 15 dias', 'Mensal'];

  return (
    <>
      <div className="welcome-section">
        <h2>Nova Dieta</h2>
        <p>Cadastre uma nova dieta para os animais</p>
      </div>
      
      <div className="page-content">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-grid">
            {/* Alimentos Disponíveis */}
            <div className="form-group full-width">
              <label>Alimentos Disponíveis no Estoque</label>
              <div className="alimentos-grid-form">
                {alimentos.map(alimento => (
                  <div 
                    key={alimento.id} 
                    className={`alimento-item-form ${alimentosSelecionados.find(a => a.id === alimento.id) ? 'selected' : ''}`}
                    onClick={() => handleSelecionarAlimento(alimento.id)}
                  >
                    <div className="alimento-nome-form">{alimento.nome}</div>
                    <div className="alimento-info-form">
                      <span>{alimento.quantidade} {alimento.unidade}</span>
                      <span>{alimento.categoria}</span>
                    </div>
                  </div>
                ))}
                {alimentos.length === 0 && (
                  <div className="empty-message">Nenhum alimento cadastrado no estoque. 
                    <button type="button" onClick={() => navigate('/estoque/novo')} className="btn-link">Cadastrar agora</button>
                  </div>
                )}
              </div>
            </div>

            {/* Alimentos Selecionados */}
            {alimentosSelecionados.length > 0 && (
              <div className="form-group full-width">
                <label>Alimentos Selecionados:</label>
                <div className="alimentos-selecionados">
                  {alimentosSelecionados.map(alimento => (
                    <div key={alimento.id} className="alimento-selecionado">
                      <span>{alimento.nome} - {alimento.quantidade} {alimento.unidade}</span>
                      <button type="button" onClick={() => handleRemoverAlimento(alimento.id)}>✖</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
              <label>Quantidade por Animal *</label>
              <input type="number" step="0.01" name="quantidade" value={formData.quantidade} onChange={handleChange} required placeholder="Ex: 5" />
            </div>
            
            <div className="form-group">
              <label>Unidade *</label>
              <select name="unidade" value={formData.unidade} onChange={handleChange}>
                {unidades.map(u => (
                  <option key={u} value={u}>{u}</option>
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
            
            {/* Seleção de Animais */}
            <div className="form-group full-width">
              <label>Selecionar Animais *</label>
              <div className="animal-selection">
                <select onChange={(e) => handleSelecionarAnimal(e.target.value)} value="">
                  <option value="">Selecione um animal</option>
                  {animais
                    .filter(a => !animaisSelecionados.find(s => s.id === a.id))
                    .map(animal => (
                      <option key={animal.id} value={animal.id}>
                        {animal.brinco} - {animal.nome}
                      </option>
                    ))}
                </select>
              </div>
              
              {/* Lista de animais selecionados */}
              {animaisSelecionados.length > 0 && (
                <div className="animais-selecionados">
                  <label>Animais selecionados:</label>
                  <div className="animais-tags">
                    {animaisSelecionados.map(animal => (
                      <div key={animal.id} className="animal-tag">
                        <span>{animal.brinco} - {animal.nome}</span>
                        <button type="button" onClick={() => handleRemoverAnimal(animal.id)}>✖</button>
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
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/dietas')}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading || animaisSelecionados.length === 0 || alimentosSelecionados.length === 0}>
              {loading ? 'Salvando...' : 'Salvar Dieta'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovaDieta;