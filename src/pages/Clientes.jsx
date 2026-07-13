import { useRef, useState } from 'react'
import { useClientes } from '../modules/clientes/useClientes'
import ClientesLista from '../modules/clientes/ClientesLista'
import ClienteFormulario from '../modules/clientes/ClienteFormulario'
import { exportarCsv } from '../lib/exportarArquivo'
import { lerArquivoCsv } from '../lib/importarArquivo'
import { imprimirA4 } from '../lib/imprimir'
import '../pages/Estoque.css'

export default function Clientes() {
  const { clientes, carregando, erro, adicionarCliente, editarCliente, removerCliente, importarClientes } =
    useClientes()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const inputImportarRef = useRef(null)

  function abrirNovo() {
    setClienteEmEdicao(null)
    setFormularioAberto(true)
  }

  function abrirEdicao(cliente) {
    setClienteEmEdicao(cliente)
    setFormularioAberto(true)
  }

  function fecharFormulario() {
    setFormularioAberto(false)
    setClienteEmEdicao(null)
  }

  async function salvar(dados) {
    const resultado = clienteEmEdicao
      ? await editarCliente(clienteEmEdicao.id, dados)
      : await adicionarCliente(dados)
    if (!resultado.error) fecharFormulario()
    return resultado
  }

  async function excluir(cliente) {
    const confirmar = window.confirm(`Excluir o cliente "${cliente.nome}"?`)
    if (!confirmar) return
    await removerCliente(cliente.id)
  }

  function exportarExcel() {
    const cabecalhos = ['Nome', 'Telefone', 'E-mail', 'Endereço', 'Observações']
    const linhas = clientes.map((c) => [c.nome, c.telefone || '', c.email || '', c.endereco || '', c.observacoes || ''])
    exportarCsv('clientes', cabecalhos, linhas)
  }

  async function aoImportarArquivo(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setMensagem('')

    const registros = await lerArquivoCsv(arquivo)
    const clientesValidos = registros
      .map((r) => ({
        nome: r.nome || r.name || '',
        telefone: r.telefone || r.phone || null,
        email: r.email || null,
        endereco: r.endereco || r['endereço'] || null,
        observacoes: r.observacoes || r['observações'] || null,
      }))
      .filter((c) => c.nome.trim() !== '')

    if (clientesValidos.length === 0) {
      setMensagem('Nenhum cliente válido encontrado no arquivo (verifique se há uma coluna "nome").')
      e.target.value = ''
      return
    }

    const resultado = await importarClientes(clientesValidos)
    setMensagem(
      resultado.error
        ? 'Não foi possível importar os clientes.'
        : `${clientesValidos.length} cliente(s) importado(s) com sucesso.`
    )
    e.target.value = ''
  }

  function imprimir() {
    imprimirA4()
  }

  return (
    <div>
      <div className="estoque-topo no-imprimir">
        <p>Cadastre clientes manualmente ou importe uma planilha (.csv) exportada do Excel.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secundario" onClick={() => inputImportarRef.current?.click()}>
            📥 Importar Excel
          </button>
          <input
            ref={inputImportarRef}
            type="file"
            accept=".csv"
            hidden
            onChange={aoImportarArquivo}
          />
          <button className="btn btn-secundario" onClick={exportarExcel}>
            📤 Exportar Excel
          </button>
          <button className="btn btn-secundario" onClick={imprimir}>
            🖨️ Imprimir
          </button>
          <button className="btn btn-primario" onClick={abrirNovo}>
            + Novo cliente
          </button>
        </div>
      </div>

      {erro && <div className="mensagem-erro no-imprimir">{erro}</div>}
      {mensagem && <p className="config-mensagem-ok no-imprimir">{mensagem}</p>}

      {carregando ? (
        <p className="no-imprimir">Carregando clientes...</p>
      ) : (
        <ClientesLista clientes={clientes} aoEditar={abrirEdicao} aoExcluir={excluir} />
      )}

      <div className="imprimir-area imprimir-a4">
        <h3>Lista de clientes</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Endereço</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.telefone || '-'}</td>
                <td>{c.email || '-'}</td>
                <td>{c.endereco || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formularioAberto && (
        <ClienteFormulario
          clienteInicial={clienteEmEdicao}
          aoSalvar={salvar}
          aoCancelar={fecharFormulario}
        />
      )}
    </div>
  )
}
