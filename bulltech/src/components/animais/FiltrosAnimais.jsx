import React from 'react';
import './FiltrosAnimais.css';

const FiltrosAnimais = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, sexoFilter, setSexoFilter }) => {
  return (
    <div className="filters-bar-animais">
      <div className="filter-group">
        <label>Buscar:</label>
        <input 
          type="text" 
          placeholder="Buscar por nome ou brinco..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <label>Status:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>Todos</option>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Sexo:</label>
        <select value={sexoFilter} onChange={(e) => setSexoFilter(e.target.value)}>
          <option>Todos</option>
          <option>Macho</option>
          <option>Fêmea</option>
        </select>
      </div>
    </div>
  );
};

export default FiltrosAnimais;