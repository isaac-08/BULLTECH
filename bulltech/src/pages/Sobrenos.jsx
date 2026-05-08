import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import banner from '../assets/banner_sn.jpg';
import iconsSobre from '../assets/icons/sobre';

const SobreNos = () => {
  const valores = [
    { icone: iconsSobre.missao, titulo: "Missão", descricao: "Nossa missão é desenvolver tecnologias inteligentes que transformem a gestão da pecuária, tornando os processos mais eficientes, organizados e acessíveis. Buscamos facilitar o dia a dia dos produtores rurais por meio de soluções digitais que substituem métodos tradicionais, promovendo maior controle, produtividade e tomada de decisão baseada em dados." },
    { icone: iconsSobre.visao, titulo: "Visão", descricao: "Nossa visão é ser referência em inovação no agronegócio, destacando-nos como uma plataforma essencial para a modernização das fazendas. Queremos contribuir para um setor mais tecnológico, conectado e eficiente, ajudando produtores a evoluírem junto com as novas demandas do mercado." },
    { icone: iconsSobre.valor, titulo: "Valores", descricao: "A BullTech é guiada por valores que refletem nosso compromisso com o cliente e com o futuro do agronegócio. Priorizamos a organização e a transparência em todas as etapas da gestão, além de promover práticas sustentáveis que respeitam o meio ambiente e garantem o desenvolvimento responsável da pecuária." }
  ];

  const diferenciais = [
    { icone: iconsSobre.foguete, titulo: "Tecnologia de Ponta", descricao: "Utilizamos as mais modernas tecnologias para garantir performance e segurança." },
    { icone: iconsSobre.flash, titulo: "Dados em Tempo Real", descricao: "Acompanhe todas as informações da sua fazenda em tempo real." },
    { icone: iconsSobre.seguranca, titulo: "Segurança Garantida", descricao: "Seus dados estão protegidos com os mais altos padrões de segurança." },
    { icone: iconsSobre.grafico, titulo: "Suporte Especializado", descricao: "Equipe técnica preparada para atender todas as suas necessidades." },
    { icone: iconsSobre.formar, titulo: "Acesso Multiplataforma", descricao: "Acesse de qualquer lugar, pelo computador, tablet ou celular." },
    { icone: iconsSobre.whatsapp, titulo: "Atualizações Constantes", descricao: "Estamos sempre evoluindo o sistema com novas funcionalidades." }
  ];

  return (
    <div className="sobre-page">
      <Navbar />
      
      <main>
        {/* Hero Section */}
                        <section className="hero-section">
                          <img src={banner} alt="Banner BULLTECH" className="hero-banner" />
                        </section>



        {/* Nossa História */}
        <section className="historia-section">
          <div className="historia-container">
            <div className="historia-card">
              <h2>Nossa História</h2>
              <p>Nossa história começa com um problema real do campo: a dificuldade que muitos produtores enfrentam para organizar informações importantes utilizando apenas papel. Anotações perdidas, falta de controle preciso e a dificuldade de acompanhar o dia a dia da fazenda sempre foram desafios constantes no agronegócio.</p>
              <p>Foi a partir dessa realidade que, em 2026, surgiu a nossa ideia. Criamos uma solução pensada especialmente para facilitar a vida do produtor rural, trazendo mais organização, praticidade e eficiência para a gestão do rebanho.</p>
              <p>Nosso objetivo é transformar a forma como fazendeiros cuidam de seus dados, oferecendo uma plataforma completa para o gerenciamento do gado. Com ela, é possível centralizar informações, acompanhar o desenvolvimento dos animais, controlar registros importantes e tomar decisões com mais segurança.</p>
              <p>Acreditamos que a tecnologia deve ser uma aliada do campo. Por isso, desenvolvemos um sistema acessível, intuitivo e eficiente, pensado para atender desde pequenos produtores até grandes propriedades.</p>
              <p>Mais do que um site, somos uma ferramenta de apoio ao crescimento do agronegócio, ajudando produtores a economizar tempo, reduzir erros e aumentar sua produtividade.</p>
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="mvv-section">
          <div className="mvv-container">
            {valores.map((valor, index) => (
              <div key={index} className="mvv-card">
                <div className="mvv-icon">
                  <img src={valor.icone} alt={valor.titulo} className="mvv-icon-img" />
                </div>
                <h3>{valor.titulo}</h3>
                <p>{valor.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Diferenciais */}
        <section className="diferenciais-section">
          <div className="diferenciais-container">
            <h2 className="section-title">Por que escolher a BULLTECH?</h2>
            <p className="section-subtitle">Nossos diferenciais competitivos</p>
            
            <div className="diferenciais-grid">
              {diferenciais.map((dif, index) => (
                <div key={index} className="diferencial-card">
                  <div className="diferencial-icon">
                    <img src={dif.icone} alt={dif.titulo} className="diferencial-icon-img" />
                  </div>
                  <h3>{dif.titulo}</h3>
                  <p>{dif.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SobreNos;