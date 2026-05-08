import React from 'react';

const PesagensTable = ({ pesagens }) => {
  return (
    <div className="table-card">
      <h3>Últimas pesagens</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Animal</th>
            <th>Data</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          {pesagens.length > 0 ? (
            pesagens.map((pesagem, index) => (
              <tr key={index}>
                <td>{pesagem.animal}</td>
                <td>{pesagem.data}</td>
                <td>{pesagem.peso}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="empty-message">Nenhuma pesagem registrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PesagensTable;