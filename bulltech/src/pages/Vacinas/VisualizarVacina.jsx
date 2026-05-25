import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vacinasAPI } from '../../services/api';
import FormCard, { FormRow, FormGroup } from '../../components/forms/FormCard';

const VisualizarVacina = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vacina, setVacina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarVacina();
  }, [id]);

  const carregarVacina = async () => {
    try {
      setLoading(true);
      const data = await vacinasAPI.getOne(id);
      setVacina(data);
    } catch (error) {
      console.error('Erro ao carregar vacina:', error);
      navigate('/vacinas');
    } finally {
      setLoading(false);
    }
  };

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
            <FormGroup label="Vacina">
              <p className="view-value">{vacina.nome || '-'}</p>
            </FormGroup>
            <FormGroup label="Data de aplicação">
              <p className="view-value">{vacina.data_aplicacao ? new Date(vacina.data_aplicacao).toLocaleDateString('pt-BR') : '-'}</p>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup label="Animal">
              <p className="view-value">{vacina.animal_nome || '-'}</p>
            </FormGroup>
            <FormGroup label="Brinco">
              <p className="view-value">{vacina.animal_brinco || '-'}</p>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup label="Aplicador">
              <p className="view-value">{vacina.aplicador || '-'}</p>
            </FormGroup>
            <FormGroup label="Dose">
              <p className="view-value">{vacina.dose || '-'}</p>
            </FormGroup>
          </FormRow>

          <FormRow>
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
          <button className="btn-cancel" onClick={() => navigate('/vacinas')}>
            Voltar
          </button>
        </div>
      </div>
    </>
  );
};

export default VisualizarVacina;