import React from 'react';
import './AnimalReproducao.css';

const AnimalReproducao = ({ reproducoes = [] }) => {
  // Se não tem reproduções, mostrar dados mockados
  const reproducoesData = reproducoes.length > 0 ? reproducoes : [];

  // Formatar dados para a tabela
  const tableData = reproducoesData.map(reg => ({
    'Data': reg.dataEvento,
    'Evento': reg.tipo,
    'Resultado': reg.resultado || '-',
    'Crias Nascidas': reg.criasNascidas || 0,
    'Crias Vivas': reg.criasVivas || 0,
    'Observações': reg.observacoes || '-'
  }));

  if (reproducoesData.length === 0) {
    return (
      <div className="animal-reproducao">
        <h3>Reprodução</h3>
        <div className="empty-section">
          <p>Nenhum evento reprodutivo registrado para este animal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animal-reproducao">
      <h3>Reprodução</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Evento</th>
              <th>Resultado</th>
              <th>Crias Nascidas</th>
              <th>Crias Vivas</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {reproducoesData.map((reg, index) => (
              <tr key={index}>
                <td>{reg.dataEvento}</td>
                <td>{reg.tipo}</td>
                <td className="actions-cell">
                  <span className={`status-badge ${reg.resultado === 'Prenha' || reg.resultado === 'Sucesso' ? 'applied' : 'pending'}`}>
                    {reg.resultado || '-'}
                  </span>
                 </td>
                <td>{reg.criasNascidas || 0}</td>
                <td>{reg.criasVivas || 0}</td>
                <td>{reg.observacoes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimalReproducao;