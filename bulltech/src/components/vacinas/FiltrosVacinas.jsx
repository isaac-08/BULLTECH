import React from 'react';
import './FiltrosVacinas.css';

const FiltrosVacinas = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  tipoFilter,
  setTipoFilter
}) => {
  return (
    <div className="filters-bar-vacinas">
      <div className="filters-row">
        <div className="filter-group">
          <label>Buscar</label>
          <input 
            type="text" 
            placeholder="Buscar por brinco ou animal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="aplicada">Aplicada</option>
            <option value="pendente">Pendente</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Tipo de Vacina</label>
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="raiva">Raiva</option>
            <option value="aftosa">Febre Aftosa</option>
            <option value="brucelose">Brucelose</option>
            <option value="vermectina">Vermectina</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltrosVacinas;