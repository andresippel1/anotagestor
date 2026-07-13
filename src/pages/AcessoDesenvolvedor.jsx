import { useState } from 'react'
import { useEmpresas } from '../modules/empresas/useEmpresas'
import EmpresaFormulario from '../modules/empresas/EmpresaFormulario'
import CredenciaisGeradas from '../modules/empresas/CredenciaisGeradas'
import { formatData, formatMoeda } from '../lib/formatters'
import './Estoque.css'

export default function AcessoDesenvolvedor() {
  const { empresas, carregando, erro, criarCliente, editarEmpresa, removerEmpresa } = useEmpresas()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [empresaEmEdicao, setEmpresaEmEdicao] = useState(null)
  const [credenciaisGeradas, setCredenciaisGeradas] = useState(null)

  function abrirNova() {
    setEmpresaEmEdicao(null)
    setFormularioAberto(true)
  }

  function abrirEdicao(empresa) {
    setEmpresaEmEdicao(empresa)
    setFormularioAberto(true)
  }

  function fecharFormulario() {
    setFormularioAberto(false)
    setEmpresaEmEdicao(null)
  }

  async function salvar(dados) {
    if (empresaEmEdicao) {
      const resultado = await editarEmpresa(empresaEmEdicao.id, dados)
      if (!resultado.error) fecharFormulario()
      return resultado
    }

    const resultado = await criarCliente(dados)
    if (!resultado.error) {
      fecharFormulario()
      setCredenciaisGeradas(resultado.data)
    }
    return resultado
  }

  async function excluir(empresa) {
    const confirmar = window.confirm(
      `Excluir a empresa "${empresa.nome}"? Isso apaga TODOS os dados dela (produtos, vendas, estoque, etc). Esta ação não pode ser desfeita.`
    )
    if (!confirmar) return
    await removerEmpresa(empresa.id)
  }

  return (
    <div>
      <div className="estoque-topo">
        <p>Gerencie os clientes (empresas) que usam o sistema, plano e status da assinatura.</p>
        <button className="btn btn-primario" onClick={abrirNova}>
          + Cadastrar cliente
        </button>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      {carregando ? (
        <p>Carregando empresas...</p>
      ) : (
        <div className="estoque-tabela-wrap card">
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Plano</th>
                <th>Valor mensal</th>
                <th>Implantação</th>
                <th>Status</th>
                <th>Criada em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {empresa.logo_url && (
                        <img
                          src={empresa.logo_url}
                          alt=""
                          style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }}
                        />
                      )}
                      {empresa.nome}
                    </div>
                  </td>
                  <td>{empresa.plano}</td>
                  <td>{empresa.valor_mensalidade ? formatMoeda(empresa.valor_mensalidade) : '-'}</td>
                  <td>
                    {empresa.implantacao_paga ? (
                      <span className="tag tag-sucesso">Paga</span>
                    ) : (
                      <span className="tag tag-alerta">Pendente</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`tag ${
                        empresa.status_assinatura === 'ativo'
                          ? 'tag-sucesso'
                          : empresa.status_assinatura === 'atrasado'
                          ? 'tag-alerta'
                          : empresa.status_assinatura === 'trial'
                          ? 'tag-alerta'
                          : 'tag-erro'
                      }`}
                    >
                      {empresa.status_assinatura}
                    </span>
                  </td>
                  <td>{formatData(empresa.created_at)}</td>
                  <td className="estoque-acoes">
                    <button className="btn btn-secundario" onClick={() => abrirEdicao(empresa)}>
                      Editar
                    </button>
                    <button className="btn btn-perigo" onClick={() => excluir(empresa)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formularioAberto && (
        <EmpresaFormulario
          empresaInicial={empresaEmEdicao}
          aoSalvar={salvar}
          aoCancelar={fecharFormulario}
        />
      )}

      {credenciaisGeradas && (
        <CredenciaisGeradas
          empresa={credenciaisGeradas.empresa}
          email={credenciaisGeradas.email}
          senha={credenciaisGeradas.senha}
          aoFechar={() => setCredenciaisGeradas(null)}
        />
      )}
    </div>
  )
}
