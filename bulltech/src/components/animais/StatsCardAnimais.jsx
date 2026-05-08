import React from 'react';
import './StatsCardAnimais.css';

const StatsCardAnimais = ({ totalAtivos, totalMachos, totalFemeas }) => {
  return (
    <div className="stats-card-animais">
      <h3>Total Ativos</h3>
      <div className="stat-number">{totalAtivos}</div>
      <div className="stat-gender">
        <div className="gender-item">
          <span className="gender-label">Machos</span>
          <span className="gender-number">{totalMachos}</span>
        </div>
        <div className="gender-item">
          <span className="gender-label">Fêmeas</span>
          <span className="gender-number">{totalFemeas}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCardAnimais;