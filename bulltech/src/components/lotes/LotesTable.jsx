import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LotesTable.css';

const LotesTable = ({ lotes, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container-lotes">
      <table className="lotes-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Área (m²)</th>
            <th>Animais</th>
            <th>Tipo</th>
            <th>Peso Médio (Kg)</th>
            <th>Machos</th>
            <th>Fêmeas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {lotes.map((lote) => (
            <tr key={lote.id}>
              <td>{lote.codigo || lote.id}</td>
              <td>{lote.area || '-'}</td>
              <td>
                <span className="animal-count">{lote.total_animais || 0}</span>
                {lote.total_animais > 0 && <span className="animal-unit"> animais</span>}
               </td>
              <td>{lote.tipo || 'Pasto'}</td>
              <td>{lote.peso_medio ? `${lote.peso_medio} kg` : '-'}</td>
              <td>{lote.total_machos || 0}</td>
              <td>{lote.total_femeas || 0}</td>
              <td className="actions-cell">
                <button 
                  className="action-btn view" 
                  onClick={() => navigate(`/lotes/visualizar/${lote.id}`)}
                  title="Visualizar Lote e Animais"
                >
                  👁️
                </button>
                <button 
                  className="action-btn edit" 
                  onClick={() => navigate(`/lotes/editar/${lote.id}`)}
                  title="Editar Lote"
                >
                  ✏️
                </button>
                <button 
                  className="action-btn delete" 
                  onClick={() => onDelete(lote.id)}
                  title="Excluir Lote"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
          {lotes.length === 0 && (
            <tr>
              <td colSpan="8" className="empty-message">Nenhum lote encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LotesTable;