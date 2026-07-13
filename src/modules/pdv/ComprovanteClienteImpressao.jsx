import { formatMoeda, formatDataHora } from '../../lib/formatters'

export default function ComprovanteClienteImpressao({
  empresa,
  mesa,
  rotuloOrigem,
  itens,
  total,
  formaPagamento,
  numeroVenda,
}) {
  return (
    <div className="imprimir-area imprimir-termica">
      {empresa?.logo_url && <img src={empresa.logo_url} alt="" className="termica-logo" />}
      <h3>{empresa?.nome ?? 'Painel de Gestão'}</h3>
      {empresa?.endereco && <p>{empresa.endereco}</p>}
      {empresa?.telefone && <p>Tel: {empresa.telefone}</p>}
      {empresa?.whatsapp_contato && <p>WhatsApp: {empresa.whatsapp_contato}</p>}
      <hr />
      <p>{formatDataHora(new Date())}</p>
      <p>{mesa ? `Mesa: ${mesa.numero}` : rotuloOrigem}</p>
      {numeroVenda && <p>Venda: {numeroVenda.slice(0, 8).toUpperCase()}</p>}
      <hr />
      <table>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id}>
              <td>
                {item.quantidade}x {item.produtos?.nome ?? 'Produto'}
                <br />
                {formatMoeda(item.preco_unitario)} un.
              </td>
              <td className="comprovante-valor">
                {formatMoeda(Number(item.quantidade) * Number(item.preco_unitario))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <p>
        <strong>Total: {formatMoeda(total)}</strong>
      </p>
      {formaPagamento && <p>Pagamento: {formaPagamento}</p>}
      {empresa?.mensagem_personalizada && (
        <>
          <hr />
          <p>{empresa.mensagem_personalizada}</p>
        </>
      )}
    </div>
  )
}
