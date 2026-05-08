import React from 'react';

const GenderChart = ({ machos, femeas }) => {
  const total = machos + femeas;
  const percentualMachos = total > 0 ? (machos / total * 100).toFixed(1) : 0;
  const percentualFemeas = total > 0 ? (femeas / total * 100).toFixed(1) : 0;

  return (
    <div className="chart-card">
      <h3>Distribuição por sexo</h3>
      <div className="chart-item">
        <div className="chart-label">
          <span>Sexo Macho({machos})</span>
          <span>{percentualMachos}%</span>
        </div>
        <div className="bar-container">
          <div className="bar male" style={{ width: `${percentualMachos}%` }}></div>
        </div>
      </div>
      <div className="chart-item">
        <div className="chart-label">
          <span>Feminino({femeas})</span>
          <span>{percentualFemeas}%</span>
        </div>
        <div className="bar-container">
          <div className="bar female" style={{ width: `${percentualFemeas}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default GenderChart;