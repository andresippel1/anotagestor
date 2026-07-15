import { Link } from 'react-router-dom'
import './Home.css'

const NUMERO_WHATSAPP = '5564999862472'
const MSG_DIAGNOSTICO = encodeURIComponent(
  'Olá! Quero fazer o diagnóstico do meu negócio com o Anota Gestor.'
)
const LINK_WHATSAPP = `https://wa.me/${NUMERO_WHATSAPP}?text=${MSG_DIAGNOSTICO}`

const DORES = [
  {
    titulo: 'Caixa bagunçado',
    texto: 'Pix, cartão, dinheiro e delivery misturados, sem um total real do dia.',
  },
  {
    titulo: 'Despesas espalhadas',
    texto: 'Gastos no papel ou na memória — fácil esquecer, difícil somar.',
  },
  {
    titulo: 'Pedidos sem controle',
    texto: 'Mesa, balcão e delivery cada um de um jeito, sem histórico.',
  },
  {
    titulo: 'Lucro invisível',
    texto: 'Vendeu bem, mas não sabe dizer quanto sobrou de verdade.',
  },
]

const BENEFICIOS = [
  {
    icone: '💰',
    titulo: 'Veja quanto entrou e quanto saiu',
    texto: 'Caixa do dia sempre atualizado, com entradas e saídas organizadas automaticamente.',
  },
  {
    icone: '🧾',
    titulo: 'Controle vendas sem depender do caderno',
    texto: 'Registre cada venda — balcão, mesa ou delivery — em segundos, sem planilha e sem papel.',
  },
  {
    icone: '📦',
    titulo: 'Acompanhe produtos e estoque',
    texto: 'Saiba o que está saindo, o que está acabando e o que vale a pena repor.',
  },
  {
    icone: '📊',
    titulo: 'Relatórios simples para decidir melhor',
    texto: 'Enxergue o que mais vende e onde o dinheiro está indo, sem precisar entender de planilha.',
  },
  {
    icone: '👥',
    titulo: 'Acesso para sua equipe',
    texto: 'Cadastre funcionários com acesso próprio, sem precisar dividir sua senha principal.',
  },
  {
    icone: '📱',
    titulo: 'Acesse de onde estiver',
    texto: 'Computador, tablet ou celular — acompanhe seu negócio de qualquer lugar.',
  },
]

const PASSOS = [
  {
    numero: '01',
    titulo: 'Você faz o diagnóstico',
    texto: 'Conversamos pelo WhatsApp sobre como sua operação funciona hoje.',
  },
  {
    numero: '02',
    titulo: 'Configuramos sua base',
    texto: 'Preparamos o sistema já ajustado ao seu jeito de vender, com acompanhamento na implantação.',
  },
  {
    numero: '03',
    titulo: 'Você acompanha o resultado',
    texto: 'Passa a ver, todos os dias, exatamente quanto entrou, quanto saiu e quanto sobrou.',
  },
]

const ITENS_FUNDADOR = [
  'Controle de vendas, caixa e despesas',
  'Cadastro de produtos e estoque simples',
  'Relatórios do seu negócio',
  'Acesso para sua equipe',
  'Acompanhamento na implantação',
]

const ANTES = ['Caderno', 'Memória', 'Bagunça', 'Dúvidas']
const DEPOIS = ['Organização', 'Caixa mais claro', 'Despesas controladas', 'Mais visão do resultado']

const SEGMENTOS = [
  'Lanchonetes',
  'Marmitarias',
  'Espetarias',
  'Trailers',
  'Hamburguerias',
  'Pequenos deliverys',
  'Açaíterias',
  'Pequenos restaurantes',
]

export default function Home() {
  return (
    <div className="home">
      <header className="home-topo">
        <img src="/logo-completa.svg" alt="Anota Gestor" className="home-logo" />
        <nav className="home-nav">
          <a href="#beneficios">Benefícios</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#fundador">Cliente fundador</a>
          <a href="#contato">Contato</a>
          <Link to="/login" className="home-link-entrar">
            Entrar
          </Link>
          <a href={LINK_WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-primario">
            Fazer diagnóstico
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-conteudo">
          <span className="home-selo">Gestão simples para pequenos negócios de alimentação</span>
          <h1>
            Sua lanchonete vende. Agora ela precisa <span className="texto-gradiente">mostrar quanto sobra</span>.
          </h1>
          <p>
            Controle vendas, caixa, despesas, produtos e delivery em uma plataforma simples, feita para quem
            quer sair do caderno e enxergar melhor o resultado do dia.
          </p>
          <div className="home-hero-acoes">
            <a href={LINK_WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-primario btn-grande">
              Fazer diagnóstico pelo WhatsApp
            </a>
            <a href="#como-funciona" className="btn btn-secundario btn-grande">
              Ver como funciona
            </a>
          </div>
          <p className="home-hero-nota">Implantação assistida para os primeiros clientes.</p>
        </div>

        <div className="home-hero-visual" aria-hidden="true">
          <div className="home-mock-janela">
            <div className="home-mock-barra-app">
              <span className="home-mock-ponto home-mock-ponto-vermelho" />
              <span className="home-mock-ponto home-mock-ponto-amarelo" />
              <span className="home-mock-ponto home-mock-ponto-verde" />
              <span className="home-mock-url">painel.anotagestor.com.br</span>
            </div>

            <div className="home-mock-corpo">
              <aside className="home-mock-sidebar">
                <span className="home-mock-sidebar-logo" />
                <span className="home-mock-sidebar-item home-mock-sidebar-item-ativo" />
                <span className="home-mock-sidebar-item" />
                <span className="home-mock-sidebar-item" />
                <span className="home-mock-sidebar-item" />
                <span className="home-mock-sidebar-item" />
              </aside>

              <div className="home-mock-conteudo">
                <div className="home-mock-topo">
                  <span className="home-mock-titulo">Resumo do dia</span>
                  <span className="home-mock-data">15 jul.</span>
                </div>

                <div className="home-mock-grade">
                  <div className="home-mock-metrica">
                    <span className="home-mock-rotulo">Vendas do dia</span>
                    <strong className="home-mock-valor home-mock-valor-positivo">R$ 842,00</strong>
                  </div>
                  <div className="home-mock-metrica">
                    <span className="home-mock-rotulo">Despesas</span>
                    <strong className="home-mock-valor home-mock-valor-alerta">R$ 236,00</strong>
                  </div>
                  <div className="home-mock-metrica home-mock-metrica-destaque">
                    <span className="home-mock-rotulo">Saldo em caixa</span>
                    <strong className="home-mock-valor">R$ 606,00</strong>
                  </div>
                </div>

                <div className="home-mock-grafico">
                  <span className="home-mock-barra" style={{ height: '40%' }} />
                  <span className="home-mock-barra" style={{ height: '65%' }} />
                  <span className="home-mock-barra" style={{ height: '50%' }} />
                  <span className="home-mock-barra" style={{ height: '80%' }} />
                  <span className="home-mock-barra home-mock-barra-destaque" style={{ height: '95%' }} />
                  <span className="home-mock-barra" style={{ height: '60%' }} />
                  <span className="home-mock-barra" style={{ height: '70%' }} />
                </div>

                <div className="home-mock-linha-info">
                  <span>⚠️ Estoque baixo</span>
                  <strong>2 itens</strong>
                </div>
                <div className="home-mock-linha-info">
                  <span>🔥 Mais vendido</span>
                  <strong>X-Burger</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="home-hero-glow" />
        </div>
      </section>

      {/* DOR */}
      <section className="home-secao">
        <h2>Você vende todos os dias, mas sabe quanto realmente sobra?</h2>
        <div className="home-grade-4">
          {DORES.map((dor) => (
            <div className="home-card-dor card" key={dor.titulo}>
              <h3>{dor.titulo}</h3>
              <p>{dor.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="home-secao" id="beneficios">
        <h2>Controle sua operação em uma única plataforma</h2>
        <div className="home-grade-3">
          {BENEFICIOS.map((item) => (
            <div className="home-card-beneficio card" key={item.titulo}>
              <span className="home-beneficio-icone">{item.icone}</span>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="home-secao" id="como-funciona">
        <h2>Como funciona</h2>
        <div className="home-passos">
          {PASSOS.map((passo) => (
            <div className="home-passo" key={passo.numero}>
              <span className="home-passo-numero">{passo.numero}</span>
              <h3>{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLIENTE FUNDADOR */}
      <section className="home-secao" id="fundador">
        <div className="home-fundador card">
          <span className="home-selo home-selo-fundador">Cliente fundador</span>
          <h2>Implantação assistida para os primeiros clientes</h2>
          <p className="home-fundador-preco">
            A partir de <strong>R$ 79,90</strong>
            <span>/mês</span>
          </p>

          <ul className="home-fundador-itens">
            {ITENS_FUNDADOR.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>

          <p className="home-fundador-obs">
            A taxa de implantação é combinada após uma conversa rápida, de acordo com o tamanho da sua operação.
          </p>

          <a href={LINK_WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-primario btn-grande">
            Quero participar
          </a>
        </div>
      </section>

      {/* ANTES E DEPOIS */}
      <section className="home-secao">
        <h2>Antes e depois do Anota Gestor</h2>
        <div className="home-antes-depois">
          <div className="home-coluna-antes card">
            <span className="home-coluna-rotulo">Antes</span>
            <ul>
              {ANTES.map((item) => (
                <li key={item}>✕ {item}</li>
              ))}
            </ul>
          </div>
          <div className="home-coluna-depois card">
            <span className="home-coluna-rotulo">Depois</span>
            <ul>
              {DEPOIS.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="home-secao">
        <h2>Feito para o dia a dia de quem vende comida</h2>
        <div className="home-segmentos">
          {SEGMENTOS.map((segmento) => (
            <span className="home-segmento-chip" key={segmento}>
              {segmento}
            </span>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="home-cta" id="contato">
        <h2>Quer saber se o Anota Gestor serve para sua operação?</h2>
        <p>Responda pelo WhatsApp como você controla suas vendas hoje e veja se a plataforma faz sentido para o seu negócio.</p>
        <p className="home-cta-filtro">Ideal para quem já vende todos os dias e quer parar de perder o controle no fim do mês.</p>
        <a href={LINK_WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-primario btn-grande">
          Fazer diagnóstico pelo WhatsApp
        </a>
      </section>

      {/* RODAPÉ */}
      <footer className="home-rodape">
        <div className="home-rodape-topo">
          <div className="home-rodape-marca-bloco">
            <img src="/logo-icone.svg" alt="Anota Gestor" className="home-rodape-icone" />
            <div>
              <p className="home-rodape-marca">Anota Gestor</p>
              <p className="home-rodape-slogan">Gestão simples para negócios de alimentação</p>
            </div>
          </div>

          <nav className="home-rodape-links">
            <a href="#beneficios">Benefícios</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#fundador">Cliente fundador</a>
            <a href="#contato">Contato</a>
          </nav>

          <a href={LINK_WHATSAPP} target="_blank" rel="noreferrer" className="home-rodape-whatsapp">
            Falar no WhatsApp →
          </a>
        </div>

        <div className="home-rodape-linha" />

        <div className="home-rodape-base">
          <p className="home-rodape-copy">© {new Date().getFullYear()} Anota Gestor. Todos os direitos reservados.</p>

          <div className="home-rodape-redes">
            <a
              href="https://instagram.com/anotagestor"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="home-rede-icone"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
