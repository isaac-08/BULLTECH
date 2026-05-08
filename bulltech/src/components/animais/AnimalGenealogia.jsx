import React from 'react';
import './AnimalGenealogia.css';

const AnimalGenealogia = ({ animal }) => {
  return (
    <div className="animal-genealogia">
      <h3>Genealogia</h3>
      <div className="genealogia-grid">
        <div className="genealogia-item">
          <span className="genealogia-label">Brinco da Mãe:</span>
          <span className="genealogia-value">{animal.brincoMae || 'Não informado'}</span>
        </div>
        <div className="genealogia-item">
          <span className="genealogia-label">Brinco do Pai:</span>
          <span className="genealogia-value">{animal.brincoPai || 'Não informado'}</span>
        </div>
        <div className="genealogia-item">
          <span className="genealogia-label">Registro de Origem:</span>
          <span className="genealogia-value">{animal.registroOrigem || 'Não informado'}</span>
        </div>
      </div>
    </div>
  );
};

export default AnimalGenealogia;