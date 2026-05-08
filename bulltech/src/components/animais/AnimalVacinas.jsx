import React from 'react';

const AnimalVacinas = ({ vacinas = [] }) => {
  if (!vacinas || vacinas.length === 0) {
    return (
      <div className="animal-vacinas">
        <h3>Vacinas</h3>
        <div className="empty-section">
          <p>Nenhuma vacina registrada para este animal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animal-vacinas">
      <h3>Vacinas</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Vacina</th>
              <th>Dose</th>
              <th>Aplicador</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vacinas.map((vacina, index) => (
              <tr key={index}>
                <td>{vacina.dataAplicacao}</td>
                <td>{vacina.nome}</td>
                <td>{vacina.dose || '-'}</td>
                <td>{vacina.aplicador || '-'}</td>
                <td className="actions-cell">
                  <span className={`status-badge ${vacina.status === 'Aplicada' ? 'applied' : 'pending'}`}>
                    {vacina.status || 'Aplicada'}
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

export default AnimalVacinas;