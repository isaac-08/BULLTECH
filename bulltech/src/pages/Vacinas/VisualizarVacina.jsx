import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormCard, { FormRow, FormGroup } from '../../components/forms/FormCard';

const VisualizarVacina = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vacina, setVacina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const vacinas = JSON.parse(localStorage.getItem('vacinas') || '[]');
    const found = vacinas.find(v => v.id === parseInt(id));
    if (found) {
      setVacina(found);
    } else {
      navigate('/vacinas');
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!vacina) {
    return null;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Visualizar Vacina</h2>
        <p>Veja os detalhes da vacina</p>
      </div>
      
      <div className="page-content">
        <FormCard title="Informações da Vacina">
          <FormRow>
            <FormGroup label="ID vacina">
              <p className="view-value">{vacina.nome || '-'}</p>
            </FormGroup>
            <FormGroup label="Data de aplicação">
              <p className="view-value">{vacina.dataAplicacao || '-'}</p>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup label="Animal">
              <p className="view-value">{vacina.animal || vacina.brinco || '-'}</p>
            </FormGroup>
            <FormGroup label="Aplicada por">
              <p className="view-value">{vacina.aplicador || '-'}</p>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup label="Dose">
              <p className="view-value">{vacina.dose || '-'}</p>
            </FormGroup>
            <FormGroup label="Status">
              <p className="view-value">
                <span className={`status-badge ${vacina.status === 'Aplicada' ? 'applied' : 'pending'}`}>
                  {vacina.status || '-'}
                </span>
              </p>
            </FormGroup>
          </FormRow>

          <FormGroup label="Observações">
            <p className="view-value">{vacina.observacoes || 'Nenhuma observação'}</p>
          </FormGroup>
        </FormCard>

        <div className="form-actions">
          <button className="btn-edit" onClick={() => navigate(`/vacinas/editar/${vacina.id}`)}>
            Editar Vacina
          </button>
        </div>
      </div>
    </>
  );
};

export default VisualizarVacina;