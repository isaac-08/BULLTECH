import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VisualizarProduto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const produtos = JSON.parse(localStorage.getItem('estoque') || '[]');
    const found = produtos.find(p => p.id === parseInt(id));
    if (found) {
      setProduto(found);
    } else {
      navigate('/estoque');
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Visualizar Produto</h2>
          <p>Veja os detalhes do produto</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!produto) {
    return null;
  }

  const valorTotal = produto.quantidade * produto.precoUnitario;

  return (
    <>
      <div className="welcome-section">
        <h2>Visualizar Produto</h2>
        <p>Veja os detalhes do produto</p>
      </div>
      
      <div className="page-content">
        <div className="animal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nome do Produto</label>
              <p className="view-value">{produto.nome}</p>
            </div>
            
            <div className="form-group">
              <label>Categoria</label>
              <p className="view-value">{produto.categoria}</p>
            </div>
            
            <div className="form-group">
              <label>Quantidade</label>
              <p className="view-value">{produto.quantidade} {produto.unidade}</p>
            </div>
            
            <div className="form-group">
              <label>Preço Unitário</label>
              <p className="view-value">R$ {produto.precoUnitario.toFixed(2)}</p>
            </div>
            
            <div className="form-group">
              <label>Valor Total</label>
              <p className="view-value">R$ {valorTotal.toFixed(2)}</p>
            </div>
            
            <div className="form-group">
              <label>Data de Validade</label>
              <p className="view-value">{produto.dataValidade || '-'}</p>
            </div>
            
            <div className="form-group">
              <label>Fornecedor</label>
              <p className="view-value">{produto.fornecedor || '-'}</p>
            </div>
            
            <div className="form-group full-width">
              <label>Observações</label>
              <p className="view-value">{produto.observacoes || 'Nenhuma observação'}</p>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn-edit" onClick={() => navigate(`/estoque/editar/${produto.id}`)}>
              Editar Produto
            </button>
            <button className="btn-cancel" onClick={() => navigate('/estoque')}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarProduto;