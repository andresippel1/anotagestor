import { formatMoeda } from '../../lib/formatters'
import './ComandaItemLinha.css'

export default function ComandaItemLinha({ item, aoAlterarQuantidade, aoRemover }) {
  const subtotal = Number(item.quantidade) * Number(item.preco_unitario)

  return (
    <div className="comanda-item">
      <div className="comanda-item-info">
        <strong>{item.produtos?.nome ?? 'Produto'}</strong>
        <span>{formatMoeda(item.preco_unitario)} / un.</span>
      </div>

      <div className="comanda-item-qtd">
        <button
          className="btn btn-secundario comanda-qtd-btn"
          onClick={() => aoAlterarQuantidade(item, Number(item.quantidade) - 1)}
          aria-label="Diminuir quantidade"
        >
          −
        </button>
        <span className="comanda-qtd-valor">{item.quantidade}</span>
        <button
          className="btn btn-secundario comanda-qtd-btn"
          onClick={() => aoAlterarQuantidade(item, Number(item.quantidade) + 1)}
          aria-label="Aumentar quantidade"
        >
          +
        </button>
      </div>

      <strong className="comanda-item-subtotal">{formatMoeda(subtotal)}</strong>

      <button
        className="btn btn-perigo comanda-item-remover"
        onClick={() => aoRemover(item)}
        aria-label="Remover item lançado errado"
      >
        Excluir
      </button>
    </div>
  )
}
