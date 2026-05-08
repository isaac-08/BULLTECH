import React from 'react';
import AnimalSection from './AnimalSection';

const AnimalEstatisticas = ({ stats = [] }) => {
  const statsData = [
    { label: 'Ganho médio diário', value: '850 g' },
    { label: 'Última pesagem', value: '450,5 kg' },
    { label: 'Total de vacinas', value: '8' },
    { label: 'Dias em lactação', value: '120 dias' }
  ];

  const items = stats.length > 0 ? stats : statsData;

  return (
    <AnimalSection 
      title="Estatísticas" 
      items={items}
      type="stats"
    />
  );
};

export default AnimalEstatisticas;