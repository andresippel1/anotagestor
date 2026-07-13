import { formatMoeda, formatDataHora } from '../../lib/formatters'
import '../estoque/EstoqueLista.css'

const ORIGENS = {
  manual: 'Manual',
  venda: 'Venda',
  despesa: 'Despesa',
}

export default function MovimentosLista({ movimentos, aoEditar }) {
  if (movimentos.length === 0) {
    return <p className="estoque-vazio">Nenhum movimento registrado ainda.</p>
  }

  return (
    <div className="estoque-tabela-wrap card">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Origem</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {movimentos.map((mov) => (
            <tr key={mov.id}>
              <td>{formatDataHora(mov.created_at)}</td>
              <td>{mov.descricao || '-'}</td>
              <td>{ORIGENS[mov.origem] ?? mov.origem}</td>
              <td>
                <span className={`tag ${mov.tipo === 'entrada' ? 'tag-sucesso' : 'tag-erro'}`}>
                  {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                </span>
              </td>
              <td>{formatMoeda(mov.valor)}</td>
              <td>
                {mov.origem === 'manual' && (
                  <button className="btn btn-secundario" onClick={() => aoEditar(mov)}>
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
