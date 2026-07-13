import '../estoque/EstoqueLista.css'

const ROTULOS_PAPEL = {
  admin: 'Administrador',
  gerente: 'Gerente',
  operador: 'Operador',
  super_admin: 'Desenvolvedor (Super Admin)',
}

export default function UsuariosLista({ usuarios, aoEditar, aoExcluir, aoRedefinirSenha }) {
  if (usuarios.length === 0) {
    return <p className="estoque-vazio">Nenhum funcionário cadastrado ainda.</p>
  }

  return (
    <div className="estoque-tabela-wrap card">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Função</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nome}</td>
              <td>{usuario.email || '-'}</td>
              <td>
                <span className="tag tag-sucesso">{ROTULOS_PAPEL[usuario.papel] ?? usuario.papel}</span>
              </td>
              <td className="estoque-acoes">
                {usuario.papel !== 'super_admin' && (
                  <>
                    <button className="btn btn-secundario" onClick={() => aoEditar(usuario)}>
                      Editar
                    </button>
                    <button className="btn btn-secundario" onClick={() => aoRedefinirSenha(usuario)}>
                      Redefinir senha
                    </button>
                    <button className="btn btn-perigo" onClick={() => aoExcluir(usuario)}>
                      Remover acesso
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
