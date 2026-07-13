import { useState } from 'react'
import '../estoque/EstoqueFormulario.css'

function gerarSlug(nome) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const FORM_VAZIO = {
  nome: '',
  slug: '',
  email: '',
  plano: 'trial',
  status_assinatura: 'trial',
  cor_primaria: '#ff6b35',
  cor_secundaria: '#0f1115',
  valor_mensalidade: '',
  implantacao_paga: false,
  implantacao_valor: '',
  implantacao_data: '',
  data_inicio_assinatura: '',
  data_termino_plano: '',
  documento: '',
  nome_responsavel: '',
  cep: '',
  cidade: '',
}

export default function EmpresaFormulario({ empresaInicial, aoSalvar, aoCancelar }) {
  const [form, setForm] = useState(
    empresaInicial ? { ...FORM_VAZIO, ...empresaInicial } : FORM_VAZIO
  )
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  function atualizarCampo(campo, valor) {
    setForm((atual) => {
      const novo = { ...atual, [campo]: valor }
      if (campo === 'nome' && !empresaInicial) novo.slug = gerarSlug(valor)
      return novo
    })
  }

  async function aoEnviar(e) {
    e.preventDefault()
    if (!form.nome.trim() || !form.slug.trim()) {
      setErro('Informe nome e slug da empresa.')
      return
    }
    if (!empresaInicial && !form.email.trim()) {
      setErro('Informe o e-mail do cliente — é com ele que o login vai ser criado.')
      return
    }
    setErro('')
    setSalvando(true)
    const resultado = await aoSalvar({
      ...form,
      valor_mensalidade: form.valor_mensalidade === '' ? null : Number(form.valor_mensalidade),
      implantacao_valor: form.implantacao_valor === '' ? null : Number(form.implantacao_valor),
      implantacao_data: form.implantacao_data || null,
      data_inicio_assinatura: form.data_inicio_assinatura || null,
      data_termino_plano: form.data_termino_plano || null,
    })
    setSalvando(false)
    if (resultado?.error) setErro('Não foi possível salvar (verifique se o e-mail ou o slug já existem).')
  }

  return (
    <div className="modal-fundo">
      <form className="modal-card card formulario-cliente" onSubmit={aoEnviar}>
        <h3>{empresaInicial ? 'Editar cliente' : 'Cadastrar novo cliente'}</h3>

        <h4 className="form-secao">Dados do estabelecimento</h4>

        <div className="campo">
          <label htmlFor="nomeEmpresa">Nome do cliente</label>
          <input
            id="nomeEmpresa"
            value={form.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)}
            autoFocus
          />
        </div>

        <div className="campo">
          <label htmlFor="slugEmpresa">Slug (identificador único)</label>
          <input
            id="slugEmpresa"
            value={form.slug}
            onChange={(e) => atualizarCampo('slug', e.target.value)}
          />
        </div>

        {!empresaInicial && (
          <div className="campo">
            <label htmlFor="emailCliente">E-mail do cliente (será o login dele)</label>
            <input
              id="emailCliente"
              type="email"
              value={form.email}
              onChange={(e) => atualizarCampo('email', e.target.value)}
              placeholder="cliente@email.com"
            />
          </div>
        )}

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="corPrimariaEmpresa">Cor primária</label>
            <input
              id="corPrimariaEmpresa"
              type="color"
              value={form.cor_primaria}
              onChange={(e) => atualizarCampo('cor_primaria', e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="corSecundariaEmpresa">Cor secundária</label>
            <input
              id="corSecundariaEmpresa"
              type="color"
              value={form.cor_secundaria}
              onChange={(e) => atualizarCampo('cor_secundaria', e.target.value)}
            />
          </div>
        </div>

        <h4 className="form-secao">Assinatura e cobrança</h4>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="plano">Plano</label>
            <select id="plano" value={form.plano} onChange={(e) => atualizarCampo('plano', e.target.value)}>
              <option value="trial">Trial</option>
              <option value="basico">Básico</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="statusAssinatura">Status</label>
            <select
              id="statusAssinatura"
              value={form.status_assinatura}
              onChange={(e) => atualizarCampo('status_assinatura', e.target.value)}
            >
              <option value="trial">Trial</option>
              <option value="ativo">Ativo</option>
              <option value="atrasado">Atrasado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="campo">
          <label htmlFor="valorMensalidade">Valor da mensalidade (R$)</label>
          <input
            id="valorMensalidade"
            type="number"
            step="0.01"
            min="0"
            value={form.valor_mensalidade}
            onChange={(e) => atualizarCampo('valor_mensalidade', e.target.value)}
            placeholder="Ex: 147.00"
          />
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="dataInicioAssinatura">Início da assinatura</label>
            <input
              id="dataInicioAssinatura"
              type="date"
              value={form.data_inicio_assinatura}
              onChange={(e) => atualizarCampo('data_inicio_assinatura', e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="dataTerminoPlano">Término do plano</label>
            <input
              id="dataTerminoPlano"
              type="date"
              value={form.data_termino_plano}
              onChange={(e) => atualizarCampo('data_termino_plano', e.target.value)}
            />
          </div>
        </div>

        <div className="campo campo-checkbox">
          <label htmlFor="implantacaoPaga">
            <input
              id="implantacaoPaga"
              type="checkbox"
              checked={form.implantacao_paga}
              onChange={(e) => atualizarCampo('implantacao_paga', e.target.checked)}
            />
            Taxa de implantação paga
          </label>
        </div>

        {form.implantacao_paga && (
          <div className="linha-campos">
            <div className="campo">
              <label htmlFor="implantacaoValor">Valor da implantação (R$)</label>
              <input
                id="implantacaoValor"
                type="number"
                step="0.01"
                min="0"
                value={form.implantacao_valor}
                onChange={(e) => atualizarCampo('implantacao_valor', e.target.value)}
              />
            </div>

            <div className="campo">
              <label htmlFor="implantacaoData">Data do pagamento</label>
              <input
                id="implantacaoData"
                type="date"
                value={form.implantacao_data}
                onChange={(e) => atualizarCampo('implantacao_data', e.target.value)}
              />
            </div>
          </div>
        )}

        <h4 className="form-secao">Responsável pela conta</h4>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="nomeResponsavel">Nome completo</label>
            <input
              id="nomeResponsavel"
              value={form.nome_responsavel}
              onChange={(e) => atualizarCampo('nome_responsavel', e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="documentoResponsavel">CPF / CNPJ</label>
            <input
              id="documentoResponsavel"
              value={form.documento}
              onChange={(e) => atualizarCampo('documento', e.target.value)}
            />
          </div>
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="cepEmpresa">CEP</label>
            <input
              id="cepEmpresa"
              value={form.cep}
              onChange={(e) => atualizarCampo('cep', e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="cidadeEmpresa">Cidade</label>
            <input
              id="cidadeEmpresa"
              value={form.cidade}
              onChange={(e) => atualizarCampo('cidade', e.target.value)}
            />
          </div>
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <div className="modal-acoes">
          <button type="button" className="btn btn-secundario" onClick={aoCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primario" disabled={salvando}>
            {salvando ? 'Salvando...' : empresaInicial ? 'Salvar alterações' : 'Cadastrar cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}
