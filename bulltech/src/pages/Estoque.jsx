import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { estoqueAPI } from '../services/api';
import { podeAdicionar, getPlanoAtual } from '../utils/limites';
import iconsAcoes from '../assets/icons/acoes';
import estoqueIcon from '../assets/icons/estoque.png';

const Estoque = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todos');
  const [plano, setPlano] = useState(null);
  const [atingiuLimite, setAtingiuLimite] = useState(false);

  const { editar, visu, excluir } = iconsAcoes;

  useEffect(() => {
    const planoAtual = getPlanoAtual();
    setPlano(planoAtual);
    carregarEstoque(planoAtual);
  }, []);

  const carregarEstoque = async (planoAtual = plano) => {
    try {
      setLoading(true);
      const data = await estoqueAPI.getAll();
      setProdutos(data || []);
      if (planoAtual) {
        setAtingiuLimite(data.length >= planoAtual.limites.estoque);
      }
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
      alert('Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await estoqueAPI.delete(id);
        await carregarEstoque();
        alert('Produto excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
      }
    }
  };

  const handleNovoProduto = () => {
    const verificacao = podeAdicionar('estoque', produtos.length);
    if (!verificacao.permitido) {
      alert(verificacao.mensagem);
      return;
    }
    navigate('/estoque/novo');
  };

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          produto.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = categoriaFilter === 'Todos' || produto.categoria === categoriaFilter;
    return matchesSearch && matchesCategoria;
  });

  const totalProdutos = produtos.length;
  const totalQuantidade = produtos.reduce((acc, p) => acc + (p.quantidade || 0), 0);
  const valorTotalEstoque = produtos.reduce((acc, p) => acc + ((p.quantidade || 0) * (p.preco_unitario || 0)), 0).toFixed(2);

  const categorias = ['Todos', ...new Set(produtos.map(p => p.categoria).filter(Boolean))];

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Estoque</h2>
          <p>Gerencie seus insumos, medicamentos e alimentos</p>
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
          <img src={estoqueIcon} alt="Estoque" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Estoque
        </h2>
        <p>Gerencie seus insumos, medicamentos e alimentos</p>
      </div>
      
      <div className="page-content">
        {atingiuLimite && (
          <div className="limite-alerta critico">
            <div className="limite-info">
              <span className="limite-icon">⚠️</span>
              <div className="limite-texto">
                <strong>Limite do plano atingido!</strong>
                <p>Seu {plano?.nome} permite no máximo {plano?.limites.estoque} itens no estoque. 
                   <button onClick={() => navigate('/configuracoes')} className="btn-upgrade-inline">Clique aqui</button> para fazer upgrade.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-cards-animais">
          <div className="stat-card-animais">
            <h3>Total de Produtos</h3>
            <div className="stat-number">{totalProdutos}</div>
            <div className="stat-detail">Limite: {plano?.limites.estoque}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Quantidade Total</h3>
            <div className="stat-number">{totalQuantidade}</div>
          </div>
          <div className="stat-card-animais">
            <h3>Valor Total</h3>
            <div className="stat-number">R$ {valorTotalEstoque}</div>
          </div>
        </div>

        <button 
          className="btn-novo" 
          onClick={handleNovoProduto}
          disabled={atingiuLimite}
          style={{ opacity: atingiuLimite ? 0.5 : 1, cursor: atingiuLimite ? 'not-allowed' : 'pointer' }}
        >
          + Novo Produto
        </button>

        <div className="filters-bar-animais">
          <div className="filters-row">
            <div className="filter-group">
              <label>Buscar:</label>
              <input 
                type="text" 
                placeholder="Buscar por nome ou fornecedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Categoria:</label>
              <select value={categoriaFilter} onChange={(e) => setCategoriaFilter(e.target.value)}>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Unidade</th>
                <th>Preço Unitário</th>
                <th>Valor Total</th>
                <th>Fornecedor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProdutos.map((produto) => (
                <tr key={produto.id}>
                  <td><strong>{produto.nome}</strong></td>
                  <td>{produto.categoria}</td>
                  <td className={produto.quantidade < 50 ? 'negative-gain' : ''}>{produto.quantidade}</td>
                  <td>{produto.unidade}</td>
                  <td>R$ {(produto.preco_unitario || 0).toFixed(2)}</td>
                  <td>R$ {((produto.quantidade || 0) * (produto.preco_unitario || 0)).toFixed(2)}</td>
                  <td>{produto.fornecedor || '-'}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => navigate(`/estoque/editar/${produto.id}`)}>
                      <img src={editar} alt="Editar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn view" onClick={() => navigate(`/estoque/visualizar/${produto.id}`)}>
                      <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(produto.id)}>
                      <img src={excluir} alt="Excluir" className="icon icon-sm icon-hover" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredProdutos.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-message" style={{ textAlign: 'center', padding: '40px' }}>
                    <img src={estoqueIcon} alt="Estoque" className="icon icon-md" style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <br />Nenhum produto encontrado
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

export default Estoque;