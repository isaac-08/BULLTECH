import React from 'react';

const AnimalDietas = ({ dietas = [] }) => {
  if (!dietas || dietas.length === 0) {
    return (
      <div className="animal-dietas">
        <h3>Dietas</h3>
        <div className="empty-section">
          <p>Nenhuma dieta registrada para este animal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animal-dietas">
      <h3>Dietas</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Dieta</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Frequência</th>
              <th>Data Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dietas.map((dieta, index) => (
              <tr key={index}>
                <td>{dieta.nomeDieta}</td>
                <td>{dieta.tipo || '-'}</td>
                <td>{dieta.quantidade} {dieta.unidade}</td>
                <td>{dieta.frequencia}</td>
                <td>{dieta.dataInicio}</td>
                <td className="actions-cell">
                  <span className={`status-badge ${dieta.status === 'Ativa' ? 'applied' : 'pending'}`}>
                    {dieta.status || 'Ativa'}
                  </span>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimalDietas;