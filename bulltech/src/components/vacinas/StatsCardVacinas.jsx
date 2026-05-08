import React from 'react';
import './StatsCardVacinas.css';

const StatsCardVacinas = ({ totalAplicadas, totalPendentes, totalAnimais }) => {
  return (
    <div className="stats-cards-vacinas">
      <div className="stat-card-vacina">
        <div className="stat-number">{totalAplicadas}</div>
        <div className="stat-label">Vacinas Aplicadas</div>
      </div>
      <div className="stat-card-vacina">
        <div className="stat-number">{totalPendentes}</div>
        <div className="stat-label">Vacinas Pendentes</div>
      </div>
      <div className="stat-card-vacina">
        <div className="stat-number">{totalAnimais}</div>
        <div className="stat-label">Animais Vacinados</div>
      </div>
    </div>
  );
};

export default StatsCardVacinas;