import { statusEstoque } from './estoqueUtils'
import './EstoqueLista.css'

const TAG_POR_STATUS = {
  sem_estoque: 'tag-erro',
  baixo: 'tag-alerta',
  normal: 'tag-sucesso',
}

export default function EstoqueLista({ itens, aoEditar, aoExcluir }) {
  if (itens.length === 0) {
    return <p className="estoque-vazio">Nenhum item cadastrado ainda.</p>
  }

  return (
    <div className="estoque-tabela-wrap card">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantidade</th>
            <th>Mínimo</th>
            <th>Custo un.</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => {
            const status = statusEstoque(item)
            return (
              <tr key={item.id}>
                <td className="estoque-item-nome">{item.nome}</td>
                <td>
                  {item.quantidade} {item.unidade}
                </td>
                <td>
                  {item.quantidade_minima} {item.unidade}
                </td>
                <td>{Number(item.custo_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>
                  <span className={`tag ${TAG_POR_STATUS[status.chave]}`}>
                    {status.icone} {status.rotulo}
                  </span>
                </td>
                <td className="estoque-acoes">
                  <button className="btn btn-secundario" onClick={() => aoEditar(item)}>
                    Editar
                  </button>
                  <button className="btn btn-perigo" onClick={() => aoExcluir(item)}>
                    Excluir
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
