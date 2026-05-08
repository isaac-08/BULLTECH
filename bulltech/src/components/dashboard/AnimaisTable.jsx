import React from 'react';

const AnimaisTable = ({ animais }) => {
  return (
    <div className="table-card">
      <h3>Últimos animais cadastrados</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Identificação</th>
            <th>Raça</th>
            <th>Sexo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {animais.map((animal, index) => (
            <tr key={index}>
              <td>{animal.identificacao}</td>
              <td>{animal.raca}</td>
              <td>{animal.sexo}</td>
              <td><span className="status-active">{animal.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnimaisTable;