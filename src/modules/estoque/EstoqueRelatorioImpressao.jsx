import { formatDataHora } from '../../lib/formatters'
import { statusEstoque } from './estoqueUtils'

export default function EstoqueRelatorioImpressao({ empresa, itens, somenteEstoqueBaixo }) {
  return (
    <div className="imprimir-area imprimir-a4">
      <h3>{empresa?.nome ?? 'Painel de Gestão'}</h3>
      <h4>
        Relatório de Estoque {somenteEstoqueBaixo ? '— apenas itens com estoque baixo' : ''}
      </h4>
      <p>{formatDataHora(new Date())}</p>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Unidade</th>
            <th>Qtd. atual</th>
            <th>Qtd. mínima</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => {
            const status = statusEstoque(item)
            return (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.categoria || '-'}</td>
                <td>{item.unidade}</td>
                <td>{item.quantidade}</td>
                <td>{item.quantidade_minima}</td>
                <td>
                  {status.icone} {status.rotulo}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
