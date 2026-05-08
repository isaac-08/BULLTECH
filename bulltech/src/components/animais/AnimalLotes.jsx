import React from 'react';
import './AnimalLotes.css';

const AnimalLotes = ({ animal, lotes = [] }) => {
  // Encontrar o lote atual do animal
  const loteAtual = lotes.find(l => 
    l.codigo === animal.lote || 
    l.id?.toString() === animal.lote ||
    (l.codigo && animal.lote === l.codigo)
  );

  // Histórico de lotes (simulado baseado no animal)
  const historicoLotes = [];

  return (
    <div className="animal-lotes">
      <h3>Lotes</h3>
      <div className="lotes-content">
        <div className="lote-atual">
          <span className="lote-label">Lotes Atuais</span>
          <span className="lote-value">
            {loteAtual ? `${loteAtual.codigo} - ${loteAtual.tipo || 'Pasto'}` : (animal.lote || 'Sem lote definido')}
          </span>
        </div>
        <div className="historico-lotes">
          <span className="lote-label">Histórico de Lotes</span>
          <div className="historico-list">
            {historicoLotes.length > 0 ? (
              historicoLotes.map((item, index) => (
                <div key={index} className="historico-item">
                  <span className="historico-periodo">{item.periodo}</span>
                  <span className="historico-motivo">{item.motivo}</span>
                </div>
              ))
            ) : (
              <div className="historico-item">
                <span className="historico-periodo">
                  {animal.criado_em ? new Date(animal.criado_em).toLocaleDateString('pt-BR') : 'Data de entrada'} - Atual
                </span>
                <span className="historico-motivo">
                  {loteAtual ? `Pertence ao lote ${loteAtual.codigo}` : (animal.lote ? `Pertence ao lote ${animal.lote}` : 'Sem lote definido')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalLotes;