import { formatMoeda, formatData } from '../../lib/formatters'
import '../estoque/EstoqueLista.css'

export default function DespesasLista({ despesas, aoEditar, aoExcluir, aoMarcarPaga }) {
  if (despesas.length === 0) {
    return <p className="estoque-vazio">Nenhuma despesa lançada neste filtro.</p>
  }

  return (
    <div className="estoque-tabela-wrap card">
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Vencimento</th>
            <th>Valor</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {despesas.map((despesa) => (
            <tr key={despesa.id}>
              <td>{despesa.descricao}</td>
              <td>{despesa.categoria || '-'}</td>
              <td>{formatData(despesa.data_vencimento)}</td>
              <td>{formatMoeda(despesa.valor)}</td>
              <td>
                <span className={`tag ${despesa.pago ? 'tag-sucesso' : 'tag-alerta'}`}>
                  {despesa.pago ? 'Paga' : 'Em aberto'}
                </span>
              </td>
              <td className="estoque-acoes">
                {!despesa.pago && (
                  <button className="btn btn-secundario" onClick={() => aoMarcarPaga(despesa)}>
                    Marcar paga
                  </button>
                )}
                <button className="btn btn-secundario" onClick={() => aoEditar(despesa)}>
                  Editar
                </button>
                <button className="btn btn-perigo" onClick={() => aoExcluir(despesa)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
