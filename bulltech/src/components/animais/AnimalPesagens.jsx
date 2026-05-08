import React from 'react';
import AnimalSection from './AnimalSection';

const AnimalPesagens = ({ pesagens = [] }) => {
  const pesagensData = [
    { data: '10/03/2026', peso: '450,50 kg', ganho: '850 g/dia', tipo: 'Pós-parto' },
    { data: '15/02/2026', peso: '420,30 kg', ganho: '720 g/dia', tipo: 'Rotina' },
    { data: '20/01/2026', peso: '390,00 kg', ganho: '680 g/dia', tipo: 'Rotina' }
  ];

  const items = pesagens.length > 0 ? pesagens : pesagensData;

  return (
    <AnimalSection 
      title="Pesagens" 
      items={items}
      type="table"
    />
  );
};

export default AnimalPesagens;