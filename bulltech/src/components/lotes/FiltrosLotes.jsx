import React from 'react';
import './FiltrosLotes.css';

const FiltrosLotes = ({ 
  searchTerm, 
  setSearchTerm, 
  tipoFilter, 
  setTipoFilter,
  ordemFilter,
  setOrdemFilter
}) => {
  return (
    <div className="filters-bar-lotes">
      <div className="filters-row">
        <div className="filter-group">
          <label>Código ID</label>
          <input 
            type="text" 
            placeholder="Buscar por código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Tipo</label>
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="pasto">Pasto</option>
            <option value="confinamento">Confinamento</option>
            <option value="quarentena">Quarentena</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Ordenar por</label>
          <select value={ordemFilter} onChange={(e) => setOrdemFilter(e.target.value)}>
            <option value="recentes">Mais recentes</option>
            <option value="antigos">Mais antigos</option>
            <option value="maior">Maior quantidade</option>
            <option value="menor">Menor quantidade</option>
          </select>
        </div>
      </div>
      <div className="filters-actions">
        <button className="btn-filter">Filtrar</button>
        <button className="btn-clear" onClick={() => {
          setSearchTerm('');
          setTipoFilter('todos');
          setOrdemFilter('recentes');
        }}>Limpar</button>
      </div>
    </div>
  );
};

export default FiltrosLotes;