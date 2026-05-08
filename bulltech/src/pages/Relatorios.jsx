import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const Relatorios = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('30');
  const [exportando, setExportando] = useState(false);
  const relatorioRef = useRef(null);
  
  // Dados reais do localStorage
  const [animais, setAnimais] = useState([]);
  const [pesagens, setPesagens] = useState([]);
  const [vacinas, setVacinas] = useState([]);
  const [reproducoes, setReproducoes] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [estoque, setEstoque] = useState([]);
  
  // Dados para gráficos
  const [crescimentoMensal, setCrescimentoMensal] = useState([]);
  const [distribuicaoSexo, setDistribuicaoSexo] = useState({ machos: 0, femeas: 0 });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    // Carregar dados do localStorage
    const storedAnimais = localStorage.getItem('animais');
    const storedPesagens = localStorage.getItem('pesagens');
    const storedVacinas = localStorage.getItem('vacinas');
    const storedReproducoes = localStorage.getItem('reproducoes');
    const storedLotes = localStorage.getItem('lotes');
    const storedFuncionarios = localStorage.getItem('funcionarios');
    const storedEstoque = localStorage.getItem('estoque');
    
    const animaisData = storedAnimais ? JSON.parse(storedAnimais) : [];
    const pesagensData = storedPesagens ? JSON.parse(storedPesagens) : [];
    const vacinasData = storedVacinas ? JSON.parse(storedVacinas) : [];
    const reproducoesData = storedReproducoes ? JSON.parse(storedReproducoes) : [];
    const lotesData = storedLotes ? JSON.parse(storedLotes) : [];
    const funcionariosData = storedFuncionarios ? JSON.parse(storedFuncionarios) : [];
    const estoqueData = storedEstoque ? JSON.parse(storedEstoque) : [];
    
    setAnimais(animaisData);
    setPesagens(pesagensData);
    setVacinas(vacinasData);
    setReproducoes(reproducoesData);
    setLotes(lotesData);
    setFuncionarios(funcionariosData);
    setEstoque(estoqueData);
    
    calcularEstatisticas(animaisData);
    setLoading(false);
  };

  const calcularEstatisticas = (animaisData) => {
    // Crescimento mensal baseado na data de criação dos animais
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const animaisPorMes = new Array(12).fill(0);
    
    animaisData.forEach(animal => {
      if (animal.criado_em || animal.createdAt) {
        const data = new Date(animal.criado_em || animal.createdAt);
        if (!isNaN(data.getMonth())) {
          const mes = data.getMonth();
          animaisPorMes[mes]++;
        }
      }
    });
    
    setCrescimentoMensal(meses.map((mes, index) => ({ mes, quantidade: animaisPorMes[index] })));
    
    // Distribuição por sexo
    setDistribuicaoSexo({
      machos: animaisData.filter(a => a.sexo === 'Macho').length,
      femeas: animaisData.filter(a => a.sexo === 'Fêmea').length
    });
  };

  // Filtrar dados por período selecionado
  const getDadosPorPeriodo = () => {
    const dias = parseInt(periodo);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    
    const pesagensPeriodo = pesagens.filter(p => {
      if (!p.dataPesagem) return false;
      const partes = p.dataPesagem.split('/');
      if (partes.length !== 3) return false;
      const dataPesagem = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
      return dataPesagem >= dataLimite;
    });
    
    const vacinasPeriodo = vacinas.filter(v => {
      if (!v.dataAplicacao) return false;
      const partes = v.dataAplicacao.split('/');
      if (partes.length !== 3) return false;
      const dataVacina = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
      return dataVacina >= dataLimite;
    });
    
    const partosPeriodo = reproducoes.filter(r => {
      if (r.tipo !== 'Parto') return false;
      if (!r.dataEvento) return false;
      const partes = r.dataEvento.split('/');
      if (partes.length !== 3) return false;
      const dataParto = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
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

  // Estatísticas baseadas nos dados reais
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
  
  const maiorLote = lotes.length > 0 ? lotes.reduce((max, l) => (l.total_animais || 0) > (max.total_animais || 0) ? l : max, lotes[0]) : null;
  const maxAnimais = Math.max(...crescimentoMensal.map(m => m.quantidade), 1);

  if (loading) {
    return (
      <>
        <div className="welcome-section">
          <h2>Relatórios e Estatísticas</h2>
          <p>Visualize os dados da sua propriedade</p>
        </div>
        <div className="page-content">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Relatórios e Estatísticas</h2>
        <p>Visualize os dados da sua propriedade</p>
      </div>
      
      <div className="page-content">
        {/* Botão de Exportar PDF */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button 
            className="btn-export-pdf" 
            onClick={exportToPDF} 
            disabled={exportando}
            style={{ opacity: exportando ? 0.5 : 1, cursor: exportando ? 'not-allowed' : 'pointer' }}
          >
            {exportando ? '📄 Gerando PDF...' : '📄 Exportar Relatório em PDF'}
          </button>
        </div>

        {/* Conteúdo do Relatório */}
        <div ref={relatorioRef} className="relatorio-content">
          {/* Cabeçalho do relatório */}
          <div className="relatorio-header">
            <h1>BULLTECH</h1>
            <p>Relatório Gerencial - {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          {/* Seletor de Período */}
          <div className="periodo-selector">
            <span className="periodo-icon">📅</span>
            <label>Período de análise:</label>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              <option value="7">Últimos 7 dias</option>
              <option value="15">Últimos 15 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="60">Últimos 60 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>
          </div>

          {/* Cards principais - Rebanho */}
          <div className="stats-cards-animais">
            <div className="stat-card-animais">
              <h3>🐄 Total do Rebanho</h3>
              <div className="stat-number">{totalAnimais}</div>
              <div className="stat-detail">{totalMachos} machos | {totalFemeas} fêmeas</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>⚖️ Peso Médio</h3>
              <div className="stat-number">{pesoMedio} kg</div>
              <div className="stat-detail">Máx: {maiorPeso} kg | Mín: {menorPeso} kg</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>📦 Total de Lotes</h3>
              <div className="stat-number">{totalLotes}</div>
              <div className="stat-detail">{maiorLote ? `Maior: ${maiorLote.codigo} (${maiorLote.total_animais || 0} animais)` : '-'}</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>👥 Funcionários</h3>
              <div className="stat-number">{totalFuncionarios}</div>
              <div className="stat-detail">Equipe ativa na fazenda</div>
            </div>
          </div>

          {/* Cards de Atividades */}
          <div className="stats-cards-animais">
            <div className="stat-card-animais">
              <h3>💉 Total de Vacinas</h3>
              <div className="stat-number">{totalVacinas}</div>
              <div className="stat-detail">Últimos {periodo} dias: {atividades.vacinas}</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>⚖️ Total de Pesagens</h3>
              <div className="stat-number">{totalPesagens}</div>
              <div className="stat-detail">Últimos {periodo} dias: {atividades.pesagens}</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>🤰 Total de Partos</h3>
              <div className="stat-number">{totalPartos}</div>
              <div className="stat-detail">Últimos {periodo} dias: {atividades.partos}</div>
            </div>
            
            <div className="stat-card-animais">
              <h3>📦 Itens em Estoque</h3>
              <div className="stat-number">{totalEstoque}</div>
              <div className="stat-detail">Produtos cadastrados</div>
            </div>
          </div>

          {/* Gráfico de Crescimento */}
          <div className="chart-container-relatorio">
            <h3>📈 Crescimento do Rebanho (últimos 12 meses)</h3>
            <div className="chart-bars-relatorio">
              {crescimentoMensal.map((item, index) => (
                <div key={index} className="bar-item-relatorio">
                  <div 
                    className="bar-relatorio" 
                    style={{ 
                      height: `${(item.quantidade / maxAnimais) * 100}%`,
                      minHeight: item.quantidade > 0 ? '8px' : '4px'
                    }}
                  >
                    <span className="bar-value">{item.quantidade}</span>
                  </div>
                  <span className="bar-label">{item.mes}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuição por Sexo */}
          <div className="chart-container-relatorio">
            <h3>👫 Distribuição por Sexo</h3>
            <div className="distribuicao-sexo">
              <div className="sexo-item">
                <div className="sexo-label">
                  <span className="sexo-icon">♂</span>
                  <span>Machos ({distribuicaoSexo.machos})</span>
                </div>
                <div className="progress-bar-sexo">
                  <div 
                    className="progress-sexo male" 
                    style={{ width: `${totalAnimais > 0 ? (distribuicaoSexo.machos / totalAnimais) * 100 : 0}%` }}
                  >
                    {totalAnimais > 0 ? Math.round((distribuicaoSexo.machos / totalAnimais) * 100) : 0}%
                  </div>
                </div>
              </div>
              <div className="sexo-item">
                <div className="sexo-label">
                  <span className="sexo-icon">♀</span>
                  <span>Fêmeas ({distribuicaoSexo.femeas})</span>
                </div>
                <div className="progress-bar-sexo">
                  <div 
                    className="progress-sexo female" 
                    style={{ width: `${totalAnimais > 0 ? (distribuicaoSexo.femeas / totalAnimais) * 100 : 0}%` }}
                  >
                    {totalAnimais > 0 ? Math.round((distribuicaoSexo.femeas / totalAnimais) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Últimas Pesagens */}
          <div className="table-card-relatorio">
            <h3>📋 Últimas Pesagens</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Data</th>
                  <th>Peso</th>
                </tr>
              </thead>
              <tbody>
                {[...pesagens].sort((a, b) => {
                  const dataA = a.dataPesagem?.split('/').reverse().join('-');
                  const dataB = b.dataPesagem?.split('/').reverse().join('-');
                  return new Date(dataB) - new Date(dataA);
                }).slice(0, 5).map((pesagem, index) => (
                  <tr key={index}>
                    <td>{pesagem.animalNome || '-'}</td>
                    <td>{pesagem.dataPesagem || '-'}</td>
                    <td>{pesagem.peso ? `${pesagem.peso} kg` : '-'}</td>
                  </tr>
                ))}
                {pesagens.length === 0 && (
                  <tr><td colSpan="3" className="empty-message">Nenhuma pesagem registrada</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Últimas Vacinas */}
          <div className="table-card-relatorio">
            <h3>💊 Últimas Vacinas</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Vacina</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {[...vacinas].sort((a, b) => {
                  const dataA = a.dataAplicacao?.split('/').reverse().join('-');
                  const dataB = b.dataAplicacao?.split('/').reverse().join('-');
                  return new Date(dataB) - new Date(dataA);
                }).slice(0, 5).map((vacina, index) => (
                  <tr key={index}>
                    <td>{vacina.animalNome || vacina.animal || '-'}</td>
                    <td>{vacina.nome}</td>
                    <td>{vacina.dataAplicacao || '-'}</td>
                  </tr>
                ))}
                {vacinas.length === 0 && (
                  <tr><td colSpan="3" className="empty-message">Nenhuma vacina registrada</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Distribuição por Lote */}
          <div className="chart-container-relatorio">
            <h3>🏠 Distribuição de Animais por Lote</h3>
            <div className="lotes-distribuicao">
              {lotes.map(lote => (
                <div key={lote.id} className="lote-item">
                  <div className="lote-info">
                    <span className="lote-nome">{lote.codigo}</span>
                    <span className="lote-quantidade">{lote.total_animais || 0} animais</span>
                  </div>
                  <div className="progress-bar-lote">
                    <div 
                      className="progress-lote" 
                      style={{ width: `${totalAnimais > 0 ? ((lote.total_animais || 0) / totalAnimais) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
              {lotes.length === 0 && <div className="empty-message">Nenhum lote cadastrado</div>}
            </div>
          </div>
          
          {/* Rodapé do relatório */}
          <div className="relatorio-footer">
            <p>Relatório gerado em {new Date().toLocaleString('pt-BR')}</p>
            <p>BULLTECH - Soluções inteligentes para gestão pecuária</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Relatorios;