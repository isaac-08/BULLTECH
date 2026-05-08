import React from 'react';
import './AnimalInfoCard.css';

const AnimalInfoCard = ({ animal }) => {
  return (
    <div className="animal-info-card">
      <div className="animal-header">
        <h2>{animal.nome}</h2>
        <button className="btn-edit">EDITAR</button>
      </div>
      
      <div className="animal-stats">
        <div className="stat-item">
          <span className="stat-label">Idade</span>
          <span className="stat-value">{animal.idade || '-'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Número</span>
          <span className="stat-value">{animal.dataNascimento ? new Date(animal.dataNascimento).toLocaleDateString('pt-BR') : '-'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Peso atual</span>
          <span className="stat-value">{animal.peso ? `${animal.peso} kg` : '-'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Quantidade de peso</span>
          <span className="stat-value">{animal.ganhoPeso || '850'} g / dia</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Vacinas</span>
          <span className="stat-value">{animal.totalVacinas || '8'}</span>
        </div>
      </div>

      <div className="animal-info-section">
        <h3>Informações básicas</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Espécie:</span>
            <span className="info-value">{animal.especie || 'Bovino'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Raça:</span>
            <span className="info-value">{animal.raca || 'Nelore'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sexo:</span>
            <span className="info-value">{animal.sexo === 'Macho' ? '♂ Macho' : '♀ Fêmea'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Categoria:</span>
            <span className="info-value">{animal.categoria || 'Matriz'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Data de Cadastro:</span>
            <span className="info-value">{animal.createdAt ? new Date(animal.createdAt).toLocaleString('pt-BR') : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalInfoCard;