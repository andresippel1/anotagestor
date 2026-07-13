import { Link } from 'react-router-dom'
import CardMetrica from '../components/CardMetrica'
import { useDashboardData } from '../modules/relatorios/useDashboardData'
import { useEstoque } from '../modules/estoque/useEstoque'
import { itensComEstoqueBaixo } from '../modules/estoque/estoqueUtils'
import { formatMoeda } from '../lib/formatters'
import { useAuth } from '../modules/auth/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { empresa } = useAuth()
  const { dados, carregando } = useDashboardData()
  const { itens: itensEstoque, carregando: carregandoEstoque } = useEstoque()

  const itensEstoqueBaixo = itensComEstoqueBaixo(itensEstoque)

  return (
    <div>
      <h3>Olá, bem-vindo(a) de volta à {empresa?.nome ?? 'sua empresa'}!</h3>
      <p className="dashboard-subtitulo">Aqui está o resumo do seu negócio hoje.</p>

      {carregando ? (
        <p>Carregando indicadores...</p>
      ) : (
        <div className="grade-cards">
          <CardMetrica titulo="Faturamento do dia" valor={formatMoeda(dados.faturamentoDia)} tom="sucesso" icone="📅" />
          <CardMetrica titulo="Faturamento do mês" valor={formatMoeda(dados.faturamentoMes)} tom="sucesso" icone="🗓️" />
          <CardMetrica titulo="Despesas do mês" valor={formatMoeda(dados.despesasMes)} tom="erro" icone="💸" />
          <CardMetrica
            titulo="Lucro estimado"
            valor={formatMoeda(dados.lucroEstimado)}
            tom={dados.lucroEstimado >= 0 ? 'sucesso' : 'erro'}
            icone="📈"
          />
          <CardMetrica
            titulo="Saldo em caixa"
            valor={formatMoeda(dados.saldoCaixa)}
            tom={dados.saldoCaixa >= 0 ? 'neutro' : 'alerta'}
            icone="💰"
          />
        </div>
      )}

      {!carregandoEstoque && itensEstoqueBaixo.length > 0 && (
        <Link to="/estoque" className="dashboard-alerta-estoque">
          <span className="dashboard-alerta-icone">⚠️</span>
          <div className="dashboard-alerta-conteudo">
            <strong>Estoque baixo ({itensEstoqueBaixo.length})</strong>
            <ul>
              {itensEstoqueBaixo.map((item) => (
                <li key={item.id}>
                  {item.nome}: {item.quantidade} {item.unidade} (mínimo {item.quantidade_minima} {item.unidade})
                </li>
              ))}
            </ul>
          </div>
          <span className="dashboard-alerta-seta">›</span>
        </Link>
      )}
    </div>
  )
}
