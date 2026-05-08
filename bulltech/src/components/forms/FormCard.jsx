import React from 'react';
import './FormCard.css';

const FormCard = ({ children, title }) => {
  return (
    <div className="form-card">
      {title && <h3 className="form-card-title">{title}</h3>}
      <div className="form-card-content">
        {children}
      </div>
    </div>
  );
};

export const FormRow = ({ children }) => {
  return <div className="form-row">{children}</div>;
};

export const FormGroup = ({ label, children, required }) => {
  return (
    <div className="form-group">
      <label>
        {label} {required && <span className="required">*</span>}
      </label>
      {children}
    </div>
  );
};

export default FormCard;