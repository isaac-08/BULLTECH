import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AnimaisTable.css';

const AnimaisTable = ({ animais, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container-animais">
      <table className="animais-table">
        <thead>
          <tr>
            <th>Brinco</th>
            <th>Nome</th>
            <th>Sexo</th>
            <th>Idade</th>
            <th>Peso (Kg)</th>
            <th>Lote</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {animais.map(animal => (
            <tr key={animal.id}>
              <td>{animal.brinco}</td>
              <td>{animal.nome}</td>
              <td>{animal.sexo}</td>
              <td>{animal.idade}</td>
              <td>{animal.peso ? `${animal.peso} kg` : '-'}</td>
              <td>{animal.lote}</td>
              <td className="actions-cell">
                <button 
                  className="action-btn edit" 
                  onClick={() => navigate(`/animais/editar/${animal.id}`)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  className="action-btn view" 
                  onClick={() => navigate(`/animais/visualizar/${animal.id}`)}
                  title="Visualizar"
                >
                  👁️
                </button>
                <button 
                  className="action-btn delete" 
                  onClick={() => onDelete(animal.id)}
                  title="Excluir"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
          {animais.length === 0 && (
            <tr>
              <td colSpan="7" className="empty-message">Nenhum animal encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AnimaisTable;