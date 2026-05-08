import React from 'react';
import './StatsCardLotes.css';

const StatsCardLotes = ({ totalLotes, totalAnimais, pesoMedio }) => {
  return (
    <div className="stats-cards-lotes">
      <div className="stat-card-lote">
        <div className="stat-number">{totalLotes}</div>
        <div className="stat-label">Total de Lotes</div>
      </div>
      <div className="stat-card-lote">
        <div className="stat-number">{totalAnimais}</div>
        <div className="stat-label">Total de animais</div>
      </div>
      <div className="stat-card-lote">
        <div className="stat-number">{pesoMedio}</div>
        <div className="stat-label">Peso médio dos lotes</div>
      </div>
    </div>
  );
};

export default StatsCardLotes;