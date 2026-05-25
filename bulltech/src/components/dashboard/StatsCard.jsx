import React from 'react';

const StatsCard = ({ title, value, iconImg, icon }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-icon">
        {iconImg ? (
          <img 
            src={iconImg} 
            alt={title} 
            className="stats-icon-img"  
          />
        ) : (
          <span>{icon}</span>
        )}
      </div>
      <div className="stats-card-info">
        <h3>{title}</h3>
        <div className="stats-value">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;