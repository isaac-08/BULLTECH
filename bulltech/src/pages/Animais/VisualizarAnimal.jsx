import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { animaisAPI, lotesAPI, pesagensAPI, vacinasAPI, reproducoesAPI } from '../../services/api';
import { calcularGanhoMedioAnimal, formatarGanhoDiario } from '../../utils/calculosPesagem';
import iconsAcoes from '../../assets/icons/acoes';
import animaisIcon from '../../assets/icons/animais.png';
import lotesIcon from '../../assets/icons/lotes.png';
import vacinasIcon from '../../assets/icons/vacinas.png';
import pesagensIcon from '../../assets/icons/pesagem.png';
import dietasIcon from '../../assets/icons/dietas.png';

const VisualizarAnimal = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lotes');

  const [pesagensReais, setPesagensReais] = useState([]);
  const [vacinasReais, setVacinasReais] = useState([]);
  const [reproducoesReais, setReproducoesReais] = useState([]);
  const [lotesReais, setLotesReais] = useState([]);
  const [dietasReais, setDietasReais] = useState([]);
  const [ganhoMedio, setGanhoMedio] = useState(null);

  const { editar, visu, excluir } = iconsAcoes;

  const tabs = [
    { id: 'lotes', label: 'Lotes', icon: lotesIcon },
    { id: 'pesagens', label: 'Pesagens', icon: pesagensIcon },
    { id: 'vacinas', label: 'Vacinas', icon: vacinasIcon },
    { id: 'reproducao', label: 'Reprodução' },
    { id: 'dietas', label: 'Dietas', icon: dietasIcon },
    { id: 'observacoes', label: 'Observações' }
  ];

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const animalData = await animaisAPI.getOne(id);
      setAnimal(animalData);

      const todasPesagens = await pesagensAPI.getAll();
      const pesagensAnimal = todasPesagens
        .filter(p => p.animal_id === parseInt(id))
        .sort((a, b) => new Date(b.data_pesagem) - new Date(a.data_pesagem));
      setPesagensReais(pesagensAnimal);

      const ganho = calcularGanhoMedioAnimal(pesagensAnimal);
      setGanhoMedio(ganho);

      const todasVacinas = await vacinasAPI.getAll();
      const vacinasAnimal = todasVacinas.filter(v => v.animal_id === parseInt(id));
      setVacinasReais(vacinasAnimal);

      const todasReproducoes = await reproducoesAPI.getAll();
      const reproducoesAnimal = todasReproducoes.filter(r => r.animal_id === parseInt(id));
      setReproducoesReais(reproducoesAnimal);

      const lotesData = await lotesAPI.getAll();
      setLotesReais(lotesData);

      const { data: dietasAnimal, error: dietasError } = await supabase
        .from('dieta_animais')
        .select(`
          id,
          dieta_id,
          data_inicio,
          status,
          dietas (
            id,
            nome,
            tipo,
            frequencia,
            observacoes
          )
        `)
        .eq('animal_id', parseInt(id))
        .eq('status', 'Ativa');

      if (dietasError) {
        console.error('Erro ao buscar dietas:', dietasError);
      } else {
        setDietasReais(dietasAnimal || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      navigate('/animais');
    } finally {
      setLoading(false);
    }
  };

  const criarTimeline = () => {
    const eventos = [];

    pesagensReais.forEach(p => {
      eventos.push({
        data: p.data_pesagem,
        titulo: 'Pesagem registrada',
        descricao: `${p.peso} kg - ${p.tipo || 'Pesagem rotineira'}`,
        icon: pesagensIcon
      });
    });

    vacinasReais.forEach(v => {
      eventos.push({
        data: v.data_aplicacao,
        titulo: `Vacinação: ${v.nome}`,
        descricao: `${v.dose || '1° dose'} - Aplicado por: ${v.aplicador || 'Não informado'}`,
        icon: vacinasIcon
      });
    });

    reproducoesReais.forEach(r => {
      eventos.push({
        data: r.data_evento,
        titulo: r.tipo === 'Parto' ? 'Parto' : 'Cobertura',
        descricao: r.tipo === 'Parto'
          ? `${r.crias_nascidas || 1} crias nascidas, ${r.crias_vivas || 1} vivas`
          : `Tipo: ${r.tipo} - Resultado: ${r.resultado || 'Realizado'}`,
        icon: null
      });
    });

    dietasReais.forEach(item => {
      if (item.dietas && item.data_inicio) {
        eventos.push({
          data: item.data_inicio,
          titulo: `Dieta: ${item.dietas.nome}`,
          descricao: `${item.dietas.frequencia || 'Diário'} - Status: ${item.status || 'Ativa'}`,
          icon: dietasIcon
        });
      }
    });

    return eventos.sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );
  };

  const timeline = criarTimeline();

  const loteAtual = lotesReais.find(
    l => l.codigo === animal?.lote
  );

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Visualizar Animal</h2>
          <p>Veja todos os detalhes do animal</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  if (!animal) {
    return null;
  }

  return (
    <>
      <div className="welcome-section">
        <h2>
          <img src={animaisIcon} alt="Animal" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {animal.nome}
        </h2>
        <p>Visualize todos os detalhes do animal</p>
      </div>

      <div className="page-content">

        <div className="animal-info-header">
          <div className="info-grid-basic">
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{animal.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Brinco:</span>
              <span className="info-value">{animal.brinco}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Nome:</span>
              <span className="info-value">{animal.nome}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Sexo:</span>
              <span className="info-value">{animal.sexo}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Idade:</span>
              <span className="info-value">{animal.idade || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Peso Atual:</span>
              <span className="info-value">{animal.peso ? `${animal.peso} kg` : '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ganho Médio:</span>
              <span className="info-value" style={{ color: ganhoMedio < 0 ? '#e74c3c' : '#27ae60' }}>
                {formatarGanhoDiario(ganhoMedio)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Raça:</span>
              <span className="info-value">{animal.raca || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Espécie:</span>
              <span className="info-value">{animal.especie || 'Bovino'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Lote:</span>
              <span className="info-value">{animal.lote || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`status-badge ${animal.status === 'Ativo' ? 'applied' : 'pending'}`}>
                {animal.status}
              </span>
            </div>
          </div>
        </div>

        <div className="animal-tabs">
          <div className="tabs-header">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon && <img src={tab.icon} alt={tab.label} className="icon icon-xs" style={{ marginRight: '6px' }} />}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tabs-content">

            {/* ABA LOTES */}
            {activeTab === 'lotes' && (
              <div className="tab-pane">
                <div className="lote-atual-info">
                  <h4>Lotes Atuais</h4>
                  <div className="lote-card">
                    <div className="lote-nome">
                      {loteAtual?.codigo || animal.lote || 'Sem lote'}
                    </div>
                    <div className="lote-tipo">
                      {loteAtual?.tipo || 'Não definido'}
                    </div>
                  </div>
                </div>
                <div className="historico-lotes-info">
                  <h4>Histórico de Lotes</h4>
                  <div className="historico-item">
                    <div className="historico-periodo">
                      {animal.created_at ? new Date(animal.created_at).toLocaleDateString('pt-BR') : 'Data de entrada'} - Atual
                    </div>
                    <div className="historico-detalhes">
                      <div className="historico-nome">
                        {loteAtual?.codigo || animal.lote || 'Sem lote'}
                      </div>
                      <div className="historico-motivo">
                        {loteAtual
                          ? `Pertence ao lote ${loteAtual.codigo}`
                          : (animal.lote ? `Pertence ao lote ${animal.lote}` : 'Sem lote definido')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA PESAGENS */}
            {activeTab === 'pesagens' && (
              <div className="tab-pane">
                {pesagensReais.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Peso (Kg)</th>
                        <th>Ganho Diário</th>
                        <th>Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pesagensReais.map((p, index) => {
                        let ganho = null;
                        if (index < pesagensReais.length - 1) {
                          const pesagemAnterior = pesagensReais[index + 1];
                          const diffDias = Math.floor(
                            (new Date(p.data_pesagem) - new Date(pesagemAnterior.data_pesagem)) / (1000 * 60 * 60 * 24)
                          );
                          if (diffDias > 0) {
                            const diffPeso = (p.peso - pesagemAnterior.peso) * 1000;
                            ganho = Math.round((diffPeso / diffDias) * 100) / 100;
                          }
                        }
                        return (
                          <tr key={index}>
                            <td>{p.data_pesagem ? new Date(p.data_pesagem).toLocaleDateString('pt-BR') : '-'}</td>
                            <td>{p.peso} kg</td>
                            <td className={ganho < 0 ? 'negative-gain' : ''}>
                              {ganho ? `${ganho} g/dia` : '-'}
                            </td>
                            <td>{p.tipo || 'Rotina'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-message">Nenhuma pesagem registrada</div>
                )}
              </div>
            )}

            {/* ABA VACINAS */}
            {activeTab === 'vacinas' && (
              <div className="tab-pane">
                {vacinasReais.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Vacina</th>
                        <th>Dose</th>
                        <th>Aplicador</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vacinasReais.map((v, index) => (
                        <tr key={index}>
                          <td>{v.data_aplicacao ? new Date(v.data_aplicacao).toLocaleDateString('pt-BR') : '-'}</td>
                          <td>{v.nome}</td>
                          <td>{v.dose || '-'}</td>
                          <td>{v.aplicador || '-'}</td>
                          <td className="actions-cell">
                            <span className={`status-badge ${v.status === 'Aplicada' ? 'applied' : 'pending'}`}>
                              {v.status || 'Aplicada'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-message">Nenhuma vacina registrada</div>
                )}
              </div>
            )}

            {/* ABA REPRODUÇÃO */}
            {activeTab === 'reproducao' && (
              <div className="tab-pane">
                {reproducoesReais.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Resultado</th>
                        <th>Crias</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reproducoesReais.map((r, index) => (
                        <tr key={index}>
                          <td>{r.data_evento ? new Date(r.data_evento).toLocaleDateString('pt-BR') : '-'}</td>
                          <td>{r.tipo}</td>
                          <td className="actions-cell">
                            <span className={`status-badge ${r.resultado === 'Prenha' || r.resultado === 'Sucesso' ? 'applied' : 'pending'}`}>
                              {r.resultado || '-'}
                            </span>
                          </td>
                          <td>{r.crias_vivas ? `${r.crias_vivas} vivas` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-message">Nenhum evento reprodutivo registrado</div>
                )}
              </div>
            )}

            {/* ABA DIETAS */}
            {activeTab === 'dietas' && (
              <div className="tab-pane">
                {dietasReais.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nome da Dieta</th>
                        <th>Tipo</th>
                        <th>Frequência</th>
                        <th>Data Início</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dietasReais.map((item, index) => (
                        <tr key={index}>
                          <td><strong>{item.dietas?.nome || '-'}</strong></td>
                          <td>{item.dietas?.tipo || '-'}</td>
                          <td>{item.dietas?.frequencia || '-'}</td>
                          <td>{item.data_inicio ? new Date(item.data_inicio).toLocaleDateString('pt-BR') : '-'}</td>
                          <td>
                            <span className={`status-badge ${item.status === 'Ativa' ? 'applied' : 'pending'}`}>
                              {item.status || 'Ativa'}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button className="action-btn view" onClick={() => navigate(`/dietas/visualizar/${item.dieta_id}`)}>
                              <img src={visu} alt="Visualizar" className="icon icon-sm icon-hover" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-message">Nenhuma dieta associada a este animal</div>
                )}
              </div>
            )}

            {/* ABA OBSERVAÇÕES */}
            {activeTab === 'observacoes' && (
              <div className="tab-pane">
                <div className="observacoes-info">
                  <p>{animal.observacoes || 'Nenhuma observação cadastrada para este animal.'}</p>
                </div>
              </div>
            )}

          </div>
        </div>

        {timeline.length > 0 && (
          <div className="timeline-container">
            <h3>📅 Linha do Tempo</h3>
            <div className="timeline">
              {timeline.map((evento, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">
                    {evento.data ? new Date(evento.data).toLocaleDateString('pt-BR') : '-'}
                  </div>
                  <div className="timeline-content">
                    {evento.icon && (
                      <img src={evento.icon} alt="" className="icon icon-xs" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    )}
                    <div className="timeline-title">{evento.titulo}</div>
                    <div className="timeline-description">{evento.descricao}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions" style={{ marginTop: '20px' }}>
          <button className="btn-edit" onClick={() => navigate(`/animais/editar/${animal.id}`)}>
            <img src={editar} alt="Editar" className="icon icon-sm icon-hover" style={{ marginRight: '5px' }} />
            Editar Animal
          </button>
          <button className="btn-cancel" onClick={() => navigate('/animais')}>
            Voltar
          </button>
        </div>

      </div>
    </>
  );
};

export default VisualizarAnimal;