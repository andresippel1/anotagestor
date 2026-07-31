import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as produtosApi from '../produtos/produtosApi'
import { formatMoeda } from '../../lib/formatters'
import './SeletorProdutos.css'

const DEPARTAMENTOS = {
  bebidas: { rotulo: 'Bebidas', icone: '🥤', classe: 'bebidas' },
  espetos: { rotulo: 'Espetos', icone: '🍢', classe: 'espetos' },
  lanches: { rotulo: 'Lanches', icone: '🍔', classe: 'lanches' },
  porcoes: { rotulo: 'Porções', icone: '🍟', classe: 'porcoes' },
  adicionais: { rotulo: 'Adicionais', icone: '➕', classe: 'adicionais' },
  outros: { rotulo: 'Outros', icone: '•', classe: 'outros' },
}

const ORDEM_DEPARTAMENTOS = ['bebidas', 'espetos', 'lanches', 'porcoes', 'adicionais', 'outros']

function normalizar(texto = '') {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

function departamentoDoProduto(produto) {
  const categoria = normalizar(produto.categoria)
  const nome = normalizar(produto.nome)

  if (categoria.includes('bebida') || /agua|coca|fanta|guarana|cerveja|lata|long neck/.test(nome)) return 'bebidas'
  if (categoria.includes('espeto') || nome.startsWith('espeto') || nome.includes('caseiro')) return 'espetos'
  if (categoria.includes('lanche') || nome.startsWith('alpha')) return 'lanches'
  if (categoria.includes('porc') || nome.startsWith('porcao')) return 'porcoes'
  if (categoria === 'ad' || categoria.includes('adicional') || nome.startsWith('adicional')) return 'adicionais'
  return 'outros'
}

export default function SeletorProdutos({ aoSelecionar }) {
  const { empresa } = useAuth()
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState('')
  const [departamentoAtivo, setDepartamentoAtivo] = useState('todos')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!empresa?.id) return
    produtosApi.listarAtivos(empresa.id).then(({ data }) => {
      setProdutos(data ?? [])
      setCarregando(false)
    })
  }, [empresa?.id])

  const produtosComDepartamento = produtos.map((produto) => ({
    ...produto,
    departamento: departamentoDoProduto(produto),
  }))
  const contagens = produtosComDepartamento.reduce((total, produto) => {
    total[produto.departamento] = (total[produto.departamento] || 0) + 1
    return total
  }, {})
  const filtrados = produtosComDepartamento.filter((produto) => {
    const correspondeBusca = normalizar(produto.nome).includes(normalizar(busca))
    const correspondeDepartamento =
      departamentoAtivo === 'todos' || produto.departamento === departamentoAtivo
    return correspondeBusca && correspondeDepartamento
  })
  const grupos = ORDEM_DEPARTAMENTOS
    .map((id) => ({ id, produtos: filtrados.filter((produto) => produto.departamento === id) }))
    .filter((grupo) => grupo.produtos.length > 0)

  return (
    <div className="seletor-produtos">
      <div className="seletor-controles">
        <label className="seletor-busca-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            className="seletor-busca"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button className="seletor-limpar" onClick={() => setBusca('')} aria-label="Limpar busca">
              ×
            </button>
          )}
        </label>

        <div className="seletor-filtros" aria-label="Filtrar produtos por departamento">
          <button
            className={`seletor-filtro ${departamentoAtivo === 'todos' ? 'ativo' : ''}`}
            onClick={() => setDepartamentoAtivo('todos')}
          >
            Todos <span>{produtos.length}</span>
          </button>
          {ORDEM_DEPARTAMENTOS.filter((id) => contagens[id]).map((id) => {
            const departamento = DEPARTAMENTOS[id]
            return (
              <button
                key={id}
                className={`seletor-filtro seletor-filtro--${departamento.classe} ${
                  departamentoAtivo === id ? 'ativo' : ''
                }`}
                onClick={() => setDepartamentoAtivo(id)}
              >
                <i aria-hidden="true" />
                {departamento.rotulo} <span>{contagens[id]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {carregando ? (
        <p>Carregando produtos...</p>
      ) : filtrados.length === 0 ? (
        <p className="seletor-vazio">Nenhum produto encontrado.</p>
      ) : (
        <div className="seletor-grupos">
          {grupos.map((grupo) => {
            const departamento = DEPARTAMENTOS[grupo.id]
            return (
              <section
                className={`seletor-grupo seletor-grupo--${departamento.classe}`}
                key={grupo.id}
                aria-labelledby={`departamento-${grupo.id}`}
              >
                <header className="seletor-grupo-cabecalho">
                  <span className="seletor-grupo-icone" aria-hidden="true">{departamento.icone}</span>
                  <h4 id={`departamento-${grupo.id}`}>{departamento.rotulo}</h4>
                  <span className="seletor-grupo-contagem">{grupo.produtos.length} itens</span>
                </header>
                <div className="seletor-grade">
                  {grupo.produtos.map((produto) => (
                    <button
                      key={produto.id}
                      className={`seletor-produto-btn seletor-produto-btn--${departamento.classe}`}
                      onClick={() => aoSelecionar(produto)}
                      title={`Adicionar ${produto.nome}`}
                    >
                      <span className="seletor-produto-nome">{produto.nome}</span>
                      <span className="seletor-produto-preco">{formatMoeda(produto.preco_venda)}</span>
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
