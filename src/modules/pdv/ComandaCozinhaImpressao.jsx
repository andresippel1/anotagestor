import { formatDataHora } from '../../lib/formatters'

export default function ComandaCozinhaImpressao({ empresa, mesa, rotuloOrigem, itens, atendente }) {
  return (
    <div className="imprimir-area imprimir-termica">
      {empresa?.logo_url && <img src={empresa.logo_url} alt="" className="termica-logo" />}
      <h3>{empresa?.nome ?? 'Painel de Gestão'}</h3>
      <h4>{mesa ? `MESA ${mesa.numero}` : rotuloOrigem}</h4>
      <p>{formatDataHora(new Date())}</p>
      {atendente && <p>Atendente: {atendente}</p>}
      <hr />
      <table>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id}>
              <td colSpan={2}>
                <strong>
                  {item.quantidade}x {item.produtos?.nome ?? 'Produto'}
                </strong>
                {item.observacao && <div>Obs: {item.observacao}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </div>
  )
}
