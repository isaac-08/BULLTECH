import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calcularGanhoMedioAnimal, formatarGanhoDiario } from '../../utils/calculosPesagem';

const VisualizarAnimal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lotes');
  
  // Dados reais
  const [pesagensReais, setPesagensReais] = useState([]);
  const [vacinasReais, setVacinasReais] = useState([]);
  const [reproducoesReais, setReproducoesReais] = useState([]);
  const [dietasReais, setDietasReais] = useState([]);
  const [lotesReais, setLotesReais] = useState([]);
  const [ganhoMedio, setGanhoMedio] = useState(null);

  const tabs = [
    { id: 'lotes', label: 'Lotes' },
    { id: 'pesagens', label: 'Pesagens' },
    { id: 'vacinas', label: 'Vacinas' },
    { id: 'reproducao', label: 'Reprodução' },
    { id: 'dietas', label: 'Dietas' },
    { id: 'observacoes', label: 'Observações' }
  ];

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = () => {
    const animais = JSON.parse(localStorage.getItem('animais') || '[]');
    const found = animais.find(a => a.id === parseInt(id));
    
    if (found) {
      setAnimal(found);
      
      // Carregar pesagens
      const todasPesagens = JSON.parse(localStorage.getItem('pesagens') || '[]');
      const pesagensAnimal = todasPesagens
        .filter(p => p.animalId === parseInt(id) || p.animalNome === found.nome)
        .sort((a, b) => {
          const dataA = a.dataPesagem.split('/').reverse().join('-');
          const dataB = b.dataPesagem.split('/').reverse().join('-');
          return new Date(dataB) - new Date(dataA);
        });
      setPesagensReais(pesagensAnimal);
      
      // Calcular ganho médio
      const ganho = calcularGanhoMedioAnimal(pesagensAnimal);
      setGanhoMedio(ganho);
      
      // Carregar vacinas
      const todasVacinas = JSON.parse(localStorage.getItem('vacinas') || '[]');
      const vacinasAnimal = todasVacinas.filter(v => 
        v.animalId === parseInt(id) || 
        v.animalBrinco === found.brinco ||
        v.animalNome === found.nome
      );
      setVacinasReais(vacinasAnimal);
      
      // Carregar reproduções
      const todasReproducoes = JSON.parse(localStorage.getItem('reproducoes') || '[]');
      const reproducoesAnimal = todasReproducoes.filter(r => r.animalId === parseInt(id));
      setReproducoesReais(reproducoesAnimal);
      
      // Carregar dietas
      const dietasPorAnimal = JSON.parse(localStorage.getItem('dietasPorAnimal') || '[]');
      const dietasAnimal = dietasPorAnimal.filter(d => d.animalId === parseInt(id));
      setDietasReais(dietasAnimal);
      
      // Carregar lotes
      const lotes = JSON.parse(localStorage.getItem('lotes') || '[]');
      setLotesReais(lotes);
    } else {
      navigate('/animais');
    }
    setLoading(false);
  };

  // Criar timeline com todos os eventos
  const criarTimeline = () => {
    const eventos = [];
    
    pesagensReais.forEach(p => {
      eventos.push({
        data: p.dataPesagem,
        titulo: 'Pesagem registrada',
        descricao: `${p.peso} kg - ${p.tipo || 'Pesagem rotineira'}`,
        tipo: 'pesagem'
      });
    });
    
    vacinasReais.forEach(v => {
      eventos.push({
        data: v.dataAplicacao,
        titulo: `Vacinação: ${v.nome}`,
        descricao: `${v.dose || '1° dose'} - Aplicado por: ${v.aplicador || 'Não informado'}`,
        tipo: 'vacina'
      });
    });
    
    reproducoesReais.forEach(r => {
      eventos.push({
        data: r.dataEvento,
        titulo: r.tipo === 'Parto' ? '🤰 Parto' : '🐂 Cobertura realizada',
        descricao: r.tipo === 'Parto' 
          ? `${r.criasNascidas || 1} crias nascidas, ${r.criasVivas || 1} vivas`
          : `Tipo: ${r.tipo} - Resultado: ${r.resultado || 'Realizado'}`,
        tipo: 'reproducao'
      });
    });
    
    dietasReais.forEach(d => {
      eventos.push({
        data: d.dataInicio,
        titulo: `Dieta: ${d.nomeDieta}`,
        descricao: `${d.quantidade} ${d.unidade} - ${d.frequencia}`,
        tipo: 'dieta'
      });
    });
    
    return eventos.sort((a, b) => {
      const dataA = a.data.split('/').reverse().join('-');
      const dataB = b.data.split('/').reverse().join('-');
      return new Date(dataB) - new Date(dataA);
    });
  };

  const timeline = criarTimeline();
  
  // Encontrar lote atual
  const loteAtual = lotesReais.find(l => 
    l.codigo === animal?.lote || 
    l.id?.toString() === animal?.lote
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
        <h2>{animal.nome}</h2>
        <p>Visualize todos os detalhes do animal</p>
      </div>
      
      <div className="page-content">
        {/* Informações básicas do animal */}
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

        {/* Abas */}
        <div className="animal-tabs">
          <div className="tabs-header">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="tabs-content">
            {/* Aba Lotes */}
            {activeTab === 'lotes' && (
              <div className="tab-pane">
                <div className="lote-atual-info">
                  <h4>Lotes Atuais</h4>
                  <div className="lote-card">
                    <div className="lote-nome">{loteAtual?.codigo || animal.lote || 'Sem lote'}</div>
                    <div className="lote-tipo">{loteAtual?.tipo || 'Não definido'}</div>
                  </div>
                </div>
                
                <div className="historico-lotes-info">
                  <h4>Histórico de Lotes</h4>
                  <div className="historico-item">
                    <div className="historico-periodo">
                      {animal.criado_em ? new Date(animal.criado_em).toLocaleDateString('pt-BR') : 'Data de entrada'} - Atual
                    </div>
                    <div className="historico-detalhes">
                      <div className="historico-nome">{loteAtual?.codigo || animal.lote || 'Sem lote'}</div>
                      <div className="historico-motivo">
                        {loteAtual ? `Pertence ao lote ${loteAtual.codigo}` : (animal.lote ? `Pertence ao lote ${animal.lote}` : 'Sem lote definido')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aba Pesagens */}
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
                          const dataAtual = new Date(p.dataPesagem.split('/').reverse().join('-'));
                          const dataAnterior = new Date(pesagemAnterior.dataPesagem.split('/').reverse().join('-'));
                          const diffDias = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));
                          if (diffDias > 0) {
                            const diffPeso = (p.peso - pesagemAnterior.peso) * 1000;
                            ganho = Math.round((diffPeso / diffDias) * 100) / 100;
                          }
                        }
                        return (
                          <tr key={index}>
                            <td>{p.dataPesagem}</td>
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

            {/* Aba Vacinas */}
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
                          <td>{v.dataAplicacao || '-'}</td>
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

            {/* Aba Reprodução */}
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
                          <td>{r.dataEvento}</td>
                          <td>{r.tipo}</td>
                          <td className="actions-cell">
                            <span className={`status-badge ${r.resultado === 'Prenha' || r.resultado === 'Sucesso' ? 'applied' : 'pending'}`}>
                              {r.resultado || '-'}
                            </span>
                           </td>
                          <td>{r.criasVivas ? `${r.criasVivas} vivas` : '-'}</td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-message">Nenhum evento reprodutivo registrado</div>
                )}
              </div>
            )}

            {/* Aba Dietas */}
            {activeTab === 'dietas' && (
              <div className="tab-pane">
                {dietasReais.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Dieta</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Frequência</th>
                        <th>Data Início</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dietasReais.map((d, index) => (
                        <tr key={index}>
                          <td>{d.nomeDieta}</td>
                          <td>{d.tipo || '-'}</td>
                          <td>{d.quantidade} {d.unidade}</td>
                          <td>{d.frequencia}</td>
                          <td>{d.dataInicio}</td>
                          <td className="actions-cell">
                            <span className={`status-badge ${d.status === 'Ativa' ? 'applied' : 'pending'}`}>
                              {d.status || 'Ativa'}
                            </span>
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

            {/* Aba Observações */}
            {activeTab === 'observacoes' && (
              <div className="tab-pane">
                <div className="observacoes-info">
                  <p>{animal.observacoes || 'Nenhuma observação cadastrada para este animal.'}</p>
                </div>
                {/* Genealogia */}
                {(animal.brincoMae || animal.brincoPai) && (
                  <div className="genealogia-info" style={{ marginTop: '20px' }}>
                    <h4>Genealogia</h4>
                    <div className="info-grid-basic">
                      <div className="info-item">
                        <span className="info-label">Brinco da Mãe:</span>
                        <span className="info-value">{animal.brincoMae || '-'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Brinco do Pai:</span>
                        <span className="info-value">{animal.brincoPai || '-'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Lote da Mãe:</span>
                        <span className="info-value">{animal.loteMae || '-'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Lote do Pai:</span>
                        <span className="info-value">{animal.lotePai || '-'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Linha do Tempo */}
        {timeline.length > 0 && (
          <div className="timeline-container">
            <h3>Linha do Tempo</h3>
            <div className="timeline">
              {timeline.map((evento, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">{evento.data}</div>
                  <div className="timeline-content">
                    <div className="timeline-title">{evento.titulo}</div>
                    <div className="timeline-description">{evento.descricao}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="form-actions" style={{ marginTop: '20px' }}>
          <button className="btn-edit" onClick={() => navigate(`/animais/editar/${animal.id}`)}>
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