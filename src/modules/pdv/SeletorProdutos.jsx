import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as produtosApi from '../produtos/produtosApi'
import { formatMoeda } from '../../lib/formatters'
import './SeletorProdutos.css'

export default function SeletorProdutos({ aoSelecionar }) {
  const { empresa } = useAuth()
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!empresa?.id) return
    produtosApi.listarAtivos(empresa.id).then(({ data }) => {
      setProdutos(data ?? [])
      setCarregando(false)
    })
  }, [empresa?.id])

  const filtrados = produtos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div className="seletor-produtos">
      <input
        className="seletor-busca"
        placeholder="Buscar produto..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {carregando ? (
        <p>Carregando produtos...</p>
      ) : filtrados.length === 0 ? (
        <p className="seletor-vazio">Nenhum produto encontrado.</p>
      ) : (
        <div className="seletor-grade">
          {filtrados.map((produto) => (
            <button
              key={produto.id}
              className="seletor-produto-btn"
              onClick={() => aoSelecionar(produto)}
            >
              <span className="seletor-produto-nome">{produto.nome}</span>
              <span className="seletor-produto-preco">{formatMoeda(produto.preco_venda)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
