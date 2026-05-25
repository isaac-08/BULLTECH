import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { podeAdicionar, getPlanoAtual } from '../utils/limites';
import iconsAcoes from '../assets/icons/acoes';
import dietasIcon from '../assets/icons/dietas.png';

const Dietas = () => {
  const navigate = useNavigate();
  const [dietas, setDietas] = useState([]);
  const [quantidadeAnimais, setQuantidadeAnimais] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [plano, setPlano] = useState(null);
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  const { editar, visu, excluir } = iconsAcoes;

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    setPlano(planoAtual);
    carregarDietas(planoAtual);
  }, []);

  const carregarDietas = async (planoAtual) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Usuário não autenticado');
        setLoading(false);
        return;
      }

      const { data: perfil, error: perfilError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (perfilError) {
        console.error('Erro ao buscar perfil:', perfilError);
        setLoading(false);
        return;
      }

      if (!perfil) {
        console.log('Perfil não encontrado');
        setLoading(false);
        return;
      }

      console.log('Perfil ID:', perfil.id);

      const { data: dietasData, error: dietasError } = await supabase
        .from('dietas')
        .select('*')
        .eq('usuario_id', perfil.id)
        .order('created_at', { ascending: false });

      if (dietasError) {
        console.error('Erro ao buscar dietas:', dietasError);
        throw dietasError;
      }
      
      console.log('Dietas carregadas:', dietasData);
      setDietas(dietasData || []);
      
      const qtdMap = {};
      for (const dieta of (dietasData || [])) {
        const { count, error } = await supabase
          .from('dieta_animais')
          .select('*', { count: 'exact', head: true })
          .eq('dieta_id', dieta.id);
        
        if (!error) {
          qtdMap[dieta.id] = count || 0;
        } else {
          qtdMap[dieta.id] = 0;
        }
      }
      setQuantidadeAnimais(qtdMap);
      
      const planoVerificacao = planoAtual || plano;
      if (planoVerificacao) {
        setAtingiuLimite((dietasData?.length || 0) >= planoVerificacao.limites.dietas);
      }
    } catch (error) {
      console.error('Erro ao carregar dietas:', error);
      alert('Erro ao carregar dietas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta dieta?')) {
      try {
        const { error } = await supabase
          .from('dietas')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        await carregarDietas();
        alert('Dieta excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir dieta:', error);
        alert('Erro ao excluir dieta');
      }
    }
  };

  const handleNovaDieta = () => {
    const verificacao = podeAdicionar('dietas', dietas.length);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/dietas/novo');
  };

  const filteredDietas = dietas.filter(dieta => {
    const matchesSearch = dieta.nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'Todos' || dieta.tipo === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  const tipos = ['Todos', ...new Set(dietas.map(d => d.tipo).filter(Boolean))];

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Dietas</h2>
          <p>Gerencie as dietas dos animais</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="welcome-section">
        <h2>
          <img src={dietasIcon} alt="Dietas" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Dietas
        </h2>
        <p>Gerencie as dietas dos animais</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.dietas} dietas. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Dietas</h3>
            <div className="stat-number">{dietas.length}</div>
            <div className="stat-detail">Limite: {plano?.limites.dietas}</div>
          </div>
        </div>

        <button 
          className="btn-novo" 
          onClick={handleNovaDieta}
          disabled={atingiuLimite}
          style={{ opacity: atingiuLimite ? 0.5 : 1, cursor: atingiuLimite ? 'not-allowed' : 'pointer' }}
        >
          + Nova Dieta
        </button>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input 
                type="text" 
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Tipo:</label>
              <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="table-container-animais">
          <table className="animais-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Frequência</th>
                <th>Animais</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDietas.length > 0 ? (
                filteredDietas.map((dieta) => (
                  <tr key={dieta.id}>
                    <td style={{ padding: '10px' }}><strong>{dieta.nome}</strong></td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        background: dieta.tipo === 'Concentrado' ? '#3498db' :
                                    dieta.tipo === 'Suplemento' ? '#2ecc71' :
                                    dieta.tipo === 'Volumoso' ? '#e67e22' : '#9b59b6',
                        color: 'white'
                      }}>
                        {dieta.tipo || 'Geral'}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{dieta.frequencia || 'Diário'}</td>
                    <td style={{ padding: '10px' }}>
                      <button
                        onClick={() => navigate(`/dietas/animais/${dieta.id}`)}
                        style={{
                          background: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 12px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        {quantidadeAnimais[dieta.id] || 0} animais
                      </button>
                    </td>
                    <td className="actions-cell" style={{ padding: '10px' }}>
                      <button className="action-btn edit" onClick={() => navigate(`/dietas/editar/${dieta.id}`)}>
                        <img src={editar} alt="Editar" className="icon icon-sm icon-hover" />
                      </button>
                      <button className="action-btn view" onClick={() => navigate(`/dietas/visualizar/${dieta.id}`)}>
                        <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(dieta.id)}>
                        <img src={excluir} alt="Excluir" className="icon icon-sm icon-hover" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-message" style={{ textAlign: 'center', padding: '40px' }}>
                    <img src={dietasIcon} alt="Dietas" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <br />
                    Nenhuma dieta cadastrada
                    <br />
                    <small>Clique em "+ Nova Dieta" para criar sua primeira dieta</small>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dietas;