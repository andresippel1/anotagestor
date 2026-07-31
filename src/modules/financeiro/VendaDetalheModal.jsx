import { useEffect, useState } from 'react'
import { formatMoeda, formatDataHora } from '../../lib/formatters'
import * as vendasApi from './vendasApi'
import '../estoque/EstoqueFormulario.css'

export default function VendaDetalheModal({ movimento, aoCancelar, aoFechar }) {
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [cancelando, setCancelando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    vendasApi.listarItensDaVenda(movimento.origem_id).then(({ data }) => {
      setItens(data ?? [])
      setCarregando(false)
    })
  }, [movimento.origem_id])

  async function confirmarCancelamento() {
    const confirmar = window.confirm(
      'Cancelar essa venda? O valor será removido do fluxo de caixa. Essa ação não pode ser desfeita.'
    )
    if (!confirmar) return
    setCancelando(true)
    const resultado = await aoCancelar(movimento)
    setCancelando(false)
    if (resultado?.error) setErro('Não foi possível cancelar a venda. Tente novamente.')
  }

  return (
    <div className="modal-fundo">
      <div className="modal-card card">
        <h3>{movimento.descricao}</h3>
        <p className="fechar-venda-total">{formatDataHora(movimento.created_at)}</p>

        {carregando ? (
          <p>Carregando itens...</p>
        ) : itens.length === 0 ? (
          <p>Itens dessa venda não foram registrados (venda anterior à atualização do sistema).</p>
        ) : (
          <div className="estoque-tabela-wrap">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qtd.</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id}>
                    <td>{item.produto_nome}</td>
                    <td>{item.quantidade}</td>
                    <td>{formatMoeda(Number(item.quantidade) * Number(item.preco_unitario))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="fechar-venda-total">Total: {formatMoeda(movimento.valor)}</p>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <div className="modal-acoes">
          <button type="button" className="btn btn-secundario" onClick={aoFechar}>
            Fechar
          </button>
          <button type="button" className="btn btn-perigo" onClick={confirmarCancelamento} disabled={cancelando}>
            {cancelando ? 'Cancelando...' : 'Cancelar venda'}
          </button>
        </div>
      </div>
    </div>
  )
}
