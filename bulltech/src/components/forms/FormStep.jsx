import React from 'react';
import './FormStep.css';

const FormStep = ({ children }) => {
  return (
    <div className="form-step">
      {children}
    </div>
  );
};

export default FormStep;