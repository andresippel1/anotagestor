import '../estoque/EstoqueLista.css'

export default function ClientesLista({ clientes, aoEditar, aoExcluir }) {
  if (clientes.length === 0) {
    return <p className="estoque-vazio">Nenhum cliente cadastrado ainda.</p>
  }

  return (
    <div className="estoque-tabela-wrap card no-imprimir">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>E-mail</th>
            <th>Endereço</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.telefone || '-'}</td>
              <td>{cliente.email || '-'}</td>
              <td>{cliente.endereco || '-'}</td>
              <td className="estoque-acoes">
                <button className="btn btn-secundario" onClick={() => aoEditar(cliente)}>
                  Editar
                </button>
                <button className="btn btn-perigo" onClick={() => aoExcluir(cliente)}>
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
