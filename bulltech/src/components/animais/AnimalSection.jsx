import React from 'react';
import './AnimalSection.css';

const AnimalSection = ({ title, items, type = 'table' }) => {
  if (!items || items.length === 0) {
    return (
      <div className="animal-section">
        <h3>{title}</h3>
        <div className="empty-section">
          <p>Nenhum registro encontrado</p>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    const headers = Object.keys(items[0]);
    
    return (
      <div className="animal-section">
        <h3>{title}</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {headers.map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  {headers.map(header => (
                    <td key={header}>{item[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

export default AnimalSection;