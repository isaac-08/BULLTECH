import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  animaisAPI, 
  pesagensAPI, 
  vacinasAPI, 
  reproducoesAPI, 
  lotesAPI, 
  funcionariosAPI, 
  estoqueAPI 
} from '../services/api';
import iconsRelat from '../assets/icons/relat';
import iconsDash from '../assets/icons/dash';

const Relatorios = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('30');
  const [exportando, setExportando] = useState(false);
  const relatorioRef = useRef(null);
  
  const [animais, setAnimais] = useState([]);
  const [pesagens, setPesagens] = useState([]);
  const [vacinas, setVacinas] = useState([]);
  const [reproducoes, setReproducoes] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [estoque, setEstoque] = useState([]);
  
  const [crescimentoMensal, setCrescimentoMensal] = useState([]);
  const [distribuicaoSexo, setDistribuicaoSexo] = useState({ machos: 0, femeas: 0 });

  // Ícones
  const { 
    data: iconData, 
    grafico: iconGrafico, 
    sexo: iconSexo, 
    lotes: iconLotes, 
    vacinas: iconVacinas, 
    pesagem: iconPesagem 
  } = iconsRelat;
  const { funcionarios: iconFuncionarios, estoque: iconEstoque } = iconsDash;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const [animaisData, pesagensData, vacinasData, reproducoesData, lotesData, funcionariosData, estoqueData] = await Promise.all([
        animaisAPI.getAll(),
        pesagensAPI.getAll(),
        vacinasAPI.getAll(),
        reproducoesAPI.getAll(),
        lotesAPI.getAll(),
        funcionariosAPI.getAll(),
        estoqueAPI.getAll()
      ]);
      
      setAnimais(animaisData || []);
      setPesagens(pesagensData || []);
      setVacinas(vacinasData || []);
      setReproducoes(reproducoesData || []);
      setLotes(lotesData || []);
      setFuncionarios(funcionariosData || []);
      setEstoque(estoqueData || []);
      
      calcularEstatisticas(animaisData || []);
    } catch (error) {
      console.error('Erro ao carregar dados para relatórios:', error);
      alert('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (animaisData) => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const animaisPorMes = new Array(12).fill(0);
    
    animaisData.forEach(animal => {
      if (animal.created_at) {
        const data = new Date(animal.created_at);
        if (!isNaN(data.getMonth())) {
          const mes = data.getMonth();
          animaisPorMes[mes]++;
        }
      }
    });
    
    setCrescimentoMensal(meses.map((mes, index) => ({ mes, quantidade: animaisPorMes[index] })));
    
    setDistribuicaoSexo({
      machos: animaisData.filter(a => a.sexo === 'Macho').length,
      femeas: animaisData.filter(a => a.sexo === 'Fêmea').length
    });
  };

  const getDadosPorPeriodo = () => {
    const dias = parseInt(periodo);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    
    const pesagensPeriodo = pesagens.filter(p => {
      if (!p.data_pesagem) return false;
      const dataPesagem = new Date(p.data_pesagem);
      return dataPesagem >= dataLimite;
    });
    
    const vacinasPeriodo = vacinas.filter(v => {
      if (!v.data_aplicacao) return false;
      const dataVacina = new Date(v.data_aplicacao);
      return dataVacina >= dataLimite;
    });
    
    const partosPeriodo = reproducoes.filter(r => {
      if (r.tipo !== 'Parto') return false;
      if (!r.data_evento) return false;
      const dataParto = new Date(r.data_evento);
      return dataParto >= dataLimite;
    });
    
    return { 
      pesagens: pesagensPeriodo.length, 
      vacinas: vacinasPeriodo.length, 
      partos: partosPeriodo.length,
      totalEventos: pesagensPeriodo.length + vacinasPeriodo.length + partosPeriodo.length
    };
  };

  const exportToPDF = async () => {
    if (!relatorioRef.current) return;
    setExportando(true);
    
    try {
      const element = relatorioRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#F1EDE1',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`relatorio_bulltech_${new Date().toLocaleDateString('pt-BR')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setExportando(false);
    }
  };

  const totalAnimais = animais.length;
  const totalMachos = animais.filter(a => a.sexo === 'Macho').length;
  const totalFemeas = animais.filter(a => a.sexo === 'Fêmea').length;
  
  const pesos = animais.map(a => a.peso).filter(p => p && p > 0);
  const pesoMedio = pesos.length > 0 ? (pesos.reduce((a, b) => a + b, 0) / pesos.length).toFixed(2) : 0;
  const maiorPeso = pesos.length > 0 ? Math.max(...pesos).toFixed(2) : 0;
  const menorPeso = pesos.length > 0 ? Math.min(...pesos).toFixed(2) : 0;
  
  const totalLotes = lotes.length;
  const totalFuncionarios = funcionarios.length;
  const totalVacinas = vacinas.length;
  const totalPesagens = pesagens.length;
  const totalPartos = reproducoes.filter(r => r.tipo === 'Parto').length;
  const totalEstoque = estoque.length;
  
  const atividades = getDadosPorPeriodo();
  
  const maiorLote = lotes.length > 0 ? lotes.reduce((max, l) => (l.total_animais || 0) > (max.total_animais || 0) ? l : max, lotes) : null;
  const maxAnimais = Math.max(...crescimentoMensal.map(m => m.quantidade), 1);

  const ultimasPesagens = [...pesagens]
    .sort((a, b) => new Date(b.data_pesagem) - new Date(a.data_pesagem))
    .slice(0, 5);

  const ultimasVacinas = [...vacinas]
    .sort((a, b) => new Date(b.data_aplicacao) - new Date(a.data_aplicacao))
    .slice(0, 5);

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Relatórios e Estatísticas</h2>
          <p>Visualize os dados da sua propriedade</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando dados...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="welcome-section">
        <h2>
          <img src={iconData} alt="Relatórios" className="icon icon-md" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Relatórios e Estatísticas
        </h2>
        <p>Visualize os dados da sua propriedade</p>
      </div>
      
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button 
            className="btn-export-pdf" 
            onClick={exportToPDF} 
            disabled={exportando}
            style={{ 
              opacity: exportando ? 0.5 : 1, 
              cursor: exportando ? 'not-allowed' : 'pointer',
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {exportando ? '📄 Gerando PDF...' : '📄 Exportar Relatório em PDF'}
          </button>
        </div>

        <div ref={relatorioRef} className="relatorio-content">
          <div className="relatorio-header" style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '2px solid #3498db' }}>
            <h1 style={{ color: '#2c3e50', fontSize: '28px' }}>🐂 BULLTECH</h1>
            <p style={{ color: '#666' }}>Relatório Gerencial - {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="periodo-selector" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="periodo-icon">📅</span>
            <label style={{ fontWeight: 'bold' }}>Período de análise:</label>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
              <option value="7">Últimos 7 dias</option>
              <option value="15">Últimos 15 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="60">Últimos 60 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>
          </div>

          <div className="stats-cards-animais">
            <div className="stat-card-animais">
              <h3>
                <img src={iconData} alt="Rebanho" className="icon icon-xs" style={{ marginRight: '5px' }} />
                Total do Rebanho
              </h3>
              <div className="stat-number">{totalAnimais}</div>
              <div className="stat-detail">{totalMachos} machos | {totalFemeas} fêmeas</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>
                <img src={iconPesagem} alt="Peso" className="icon icon-xs" style={{ marginRight: '5px' }} />
                Peso Médio
              </h3>
              <div className="stat-number">{pesoMedio} kg</div>
              <div className="stat-detail">Máx: {maiorPeso} kg | Mín: {menorPeso} kg</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>
                <img src={iconLotes} alt="Lotes" className="icon icon-xs" style={{ marginRight: '5px' }} />
                Total de Lotes
              </h3>
              <div className="stat-number">{totalLotes}</div>
              <div className="stat-detail">{maiorLote ? `Maior: ${maiorLote.codigo} (${maiorLote.total_animais || 0} animais)` : '-'}</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>
                <img src={iconFuncionarios} alt="Funcionários" className="icon icon-xs" style={{ marginRight: '5px' }} />
                Funcionários
              </h3>
              <div className="stat-number">{totalFuncionarios}</div>
              <div className="stat-detail">Equipe ativa na fazenda</div>
            </div>
          </div>

          <div className="stats-cards-animais">
            <div className="stat-card-animais">
              <h3>
                <img src={iconVacinas} alt="Vacinas" className="icon icon-xs" style={{ marginRight: '5px' }} />
                Total de Vacinas
              </h3>
              <div className="stat-number">{totalVacinas}</div>
              <div className="stat-detail">Últimos {periodo} dias: {atividades.vacinas}</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>
                <img src={iconPesagem} alt="Pesagens" className="icon icon-xs" style={{ marginRight: '5px' }} />
                Total de Pesagens
              </h3>
              <div className="stat-number">{totalPesagens}</div>
              <div className="stat-detail">Últimos {periodo} dias: {atividades.pesagens}</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>🤰 Total de Partos</h3>
              <div className="stat-number">{totalPartos}</div>
              <div className="stat-detail">Últimos {periodo} dias: {atividades.partos}</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>
                <img src={iconEstoque} alt="Estoque" className="icon icon-xs" style={{ marginRight: '5px' }} />
                Itens em Estoque
              </h3>
              <div className="stat-number">{totalEstoque}</div>
              <div className="stat-detail">Produtos cadastrados</div>
            </div>
          </div>

          <div className="chart-container-relatorio" style={{ marginTop: '30px' }}>
            <h3>
              <img src={iconGrafico} alt="Crescimento" className="icon icon-xs" style={{ marginRight: '5px' }} />
              Crescimento do Rebanho (últimos 12 meses)
            </h3>
            <div className="chart-bars-relatorio" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px', gap: '10px', marginTop: '20px' }}>
              {crescimentoMensal.map((item, index) => (
                <div key={index} className="bar-item-relatorio" style={{ flex: 1, textAlign: 'center' }}>
                  <div 
                    className="bar-relatorio" 
                    style={{ 
                      height: `${(item.quantidade / maxAnimais) * 180}px`,
                      minHeight: item.quantidade > 0 ? '8px' : '4px',
                      background: '#3498db',
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                      transition: 'height 0.3s'
                    }}
                  >
                    <span className="bar-value" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', fontWeight: 'bold' }}>{item.quantidade}</span>
                  </div>
                  <span className="bar-label" style={{ fontSize: '12px' }}>{item.mes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container-relatorio" style={{ marginTop: '30px' }}>
            <h3>
              <img src={iconSexo} alt="Sexo" className="icon icon-xs" style={{ marginRight: '5px' }} />
              Distribuição por Sexo
            </h3>
            <div className="distribuicao-sexo">
              <div className="sexo-item" style={{ ClintonBottom: '15px', marginBottom: '15px' }}>
                <div className="sexo-label" style={{ marginBottom: '5px' }}>
                  <span className="sexo-icon">♂</span>
                  <span>Machos ({distribuicaoSexo.machos})</span>
                </div>
                <div className="progress-bar-sexo" style={{ background: '#e0e0e0', borderRadius: '10px', height: '30px', overflow: 'hidden' }}>
                  <div 
                    className="progress-sexo male" 
                    style={{ 
                      width: `${totalAnimais > 0 ? (distribuicaoSexo.machos / totalAnimais) * 100 : 0}%`,
                      background: '#3498db',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {totalAnimais > 0 ? Math.round((distribuicaoSexo.machos / totalAnimais) * 100) : 0}%
                  </div>
                </div>
              </div>
              <div className="sexo-item">
                <div className="sexo-label" style={{ marginBottom: '5px' }}>
                  <span className="sexo-icon">♀</span>
                  <span>Fêmeas ({distribuicaoSexo.femeas})</span>
                </div>
                <div className="progress-bar-sexo" style={{ background: '#e0e0e0', borderRadius: '10px', height: '30px', overflow: 'hidden' }}>
                  <div 
                    className="progress-sexo female" 
                    style={{ 
                      width: `${totalAnimais > 0 ? (distribuicaoSexo.femeas / totalAnimais) * 100 : 0}%`,
                      background: '#e74c3c',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {totalAnimais > 0 ? Math.round((distribuicaoSexo.femeas / totalAnimais) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-card-relatorio" style={{ marginTop: '30px' }}>
            <h3>
              <img src={iconPesagem} alt="Pesagens" className="icon icon-xs" style={{ marginRight: '5px' }} />
              Últimas Pesagens
            </h3>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Animal</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Data</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Peso</th>
                </tr>
              </thead>
              <tbody>
                {ultimasPesagens.map((pesagem, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{pesagem.animal_nome || '-'}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{pesagem.data_pesagem ? new Date(pesagem.data_pesagem).toLocaleDateString('pt-BR') : '-'}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{pesagem.peso ? `${pesagem.peso} kg` : '-'}</td>
                  </tr>
                ))}
                {ultimasPesagens.length === 0 && (
                  <tr>
                    <td colSpan="3" className="empty-message" style={{ padding: '20px', textAlign: 'center' }}>
                      Nenhuma pesagem registrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-card-relatorio" style={{ marginTop: '30px' }}>
            <h3>
              <img src={iconVacinas} alt="Vacinas" className="icon icon-xs" style={{ marginRight: '5px' }} />
              Últimas Vacinas
            </h3>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Animal</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Vacina</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {ultimasVacinas.map((vacina, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{vacina.animal_nome || '-'}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{vacina.nome}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{vacina.data_aplicacao ? new Date(vacina.data_aplicacao).toLocaleDateString('pt-BR') : '-'}</td>
                  </tr>
                ))}
                {ultimasVacinas.length === 0 && (
                  <tr>
                    <td colSpan="3" className="empty-message" style={{ padding: '20px', textAlign: 'center' }}>
                      Nenhuma vacina registrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="chart-container-relatorio" style={{ marginTop: '30px' }}>
            <h3>
              <img src={iconLotes} alt="Lotes" className="icon icon-xs" style={{ marginRight: '5px' }} />
              Distribuição de Animais por Lote
            </h3>
            <div className="lotes-distribuicao">
              {lotes.map(lote => (
                <div key={lote.id} className="lote-item" style={{ marginBottom: '15px' }}>
                  <div className="lote-info" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span className="lote-nome" style={{ fontWeight: 'bold' }}>{lote.codigo}</span>
                    <span className="lote-quantidade">{lote.total_animais || 0} animais</span>
                  </div>
                  <div className="progress-bar-lote" style={{ background: '#e0e0e0', borderRadius: '10px', height: '20px', overflow: 'hidden' }}>
                    <div 
                      className="progress-lote" 
                      style={{ 
                        width: `${totalAnimais > 0 ? ((lote.total_animais || 0) / totalAnimais) * 100 : 0}%`,
                        background: '#2ecc71',
                        height: '100%',
                        transition: 'width 0.3s'
                      }}
                    />
                  </div>
                </div>
              ))}
              {lotes.length === 0 && <div className="empty-message" style={{ textAlign: 'center', padding: '20px' }}>Nenhum lote cadastrado</div>}
            </div>
          </div>
          
          <div className="relatorio-footer" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd', textAlign: 'center', fontSize: '12px', color: '#666' }}>
            <p>Relatório gerado em {new Date().toLocaleString('pt-BR')}</p>
            <p>BULLTECH - Soluções inteligentes para gestão pecuária</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Relatorios;