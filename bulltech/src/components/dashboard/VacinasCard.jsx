import React from 'react';

const VacinasCard = ({ vacinas }) => {
  return (
    <div className="vacinas-card">
      <h3>Próximas vacinas (30 dias)</h3>
      {vacinas.map((vacina, index) => (
        <div key={index} className="vacina-item">
          <div className="vacina-info">
            <span>{vacina.nome}</span>
            <span>{vacina.data}</span>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${vacina.percentual}%` }}></div>
          </div>
          <span className="percentual">{vacina.percentual}%</span>
        </div>
      ))}
    </div>
  );
};

export default VacinasCard;