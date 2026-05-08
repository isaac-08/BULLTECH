import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VacinasTable.css';

const VacinasTable = ({ vacinas, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container-vacinas">
      <table className="vacinas-table">
        <thead>
          <tr>
            <th>Brinco</th>
            <th>Data</th>
            <th>Sexo</th>
            <th>Vacina</th>
            <th>Aplicada por</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vacinas.map((vacina) => (
            <tr key={vacina.id}>
              <td>{vacina.brinco || vacina.animalBrinco}</td>
              <td>{vacina.dataAplicacao || vacina.data}</td>
              <td>{vacina.sexo || '-'}</td>
              <td>{vacina.nome || vacina.tipo}</td>
              <td>{vacina.aplicador || '-'}</td>
              <td>
                <span className={`status-badge ${vacina.status === 'Aplicada' ? 'applied' : 'pending'}`}>
                  {vacina.status || 'Pendente'}
                </span>
              </td>
              <td className="actions-cell">
                <button 
                  className="action-btn edit" 
                  onClick={() => navigate(`/vacinas/editar/${vacina.id}`)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  className="action-btn view" 
                  onClick={() => navigate(`/vacinas/visualizar/${vacina.id}`)}
                  title="Visualizar"
                >
                  👁️
                </button>
                <button 
                  className="action-btn delete" 
                  onClick={() => onDelete(vacina.id)}
                  title="Excluir"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
          {vacinas.length === 0 && (
            <tr>
              <td colSpan="7" className="empty-message">Nenhuma vacina encontrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VacinasTable;