import React, { useState } from 'react';
import './WizardForm.css';

const WizardForm = ({ steps, onComplete, onCancel, initialData = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="wizard-form">
      <div className="wizard-steps">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`wizard-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      <div className="wizard-content">
        <StepComponent 
          data={formData} 
          onChange={handleChange} 
        />
      </div>

      <div className="wizard-actions">
        {currentStep > 0 && (
          <button type="button" className="btn-prev" onClick={handlePrev}>
            ← Anterior
          </button>
        )}
        <button type="button" className="btn-next" onClick={handleNext}>
          {currentStep === steps.length - 1 ? 'Cadastrar Animal' : 'Próximo →'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default WizardForm;