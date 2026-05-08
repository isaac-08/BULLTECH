import React from 'react';
import './AnimalTimeline.css';

const AnimalTimeline = ({ eventos = [] }) => {
  const eventosPadrao = [
    { data: '10/03/2026', titulo: 'Pesagem registrada', descricao: '450,50 kg - Pesagem pós-parto' },
    { data: '05/03/2026', titulo: 'Vacinação: Febre Aftosa', descricao: '3° dose - Aplicado por: João Silva' },
    { data: '20/03/2026', titulo: 'Parto', descricao: '1 crias nascidas, 1 vivas' },
    { data: '15/06/2025', titulo: 'Cobertura realizada', descricao: 'Tipo: Inseminação - Resultado: prenha' }
  ];

  const eventosExibir = eventos.length > 0 ? eventos : eventosPadrao;

  return (
    <div className="animal-timeline">
      <h3>Linha do Tempo</h3>
      <div className="timeline">
        {eventosExibir.map((evento, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-date">{evento.data}</div>
            <div className="timeline-content">
              <div className="timeline-title">{evento.titulo}</div>
              <div className="timeline-description">{evento.descricao}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalTimeline;