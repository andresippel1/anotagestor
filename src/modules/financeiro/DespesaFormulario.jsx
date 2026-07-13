import { useState } from 'react'
import '../estoque/EstoqueFormulario.css'

export default function DespesaFormulario({ despesaInicial, aoSalvar, aoCancelar }) {
  const [form, setForm] = useState(
    despesaInicial ?? {
      descricao: '',
      categoria: '',
      tipo: 'empresa',
      valor: 0,
      data_vencimento: '',
      pago: false,
    }
  )
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function aoEnviar(e) {
    e.preventDefault()
    if (!form.descricao.trim() || Number(form.valor) <= 0) {
      setErro('Informe a descrição e um valor válido.')
      return
    }
    setErro('')
    setSalvando(true)
    const resultado = await aoSalvar({
      descricao: form.descricao.trim(),
      categoria: form.categoria?.trim() || null,
      tipo: form.tipo,
      valor: Number(form.valor),
      data_vencimento: form.data_vencimento || null,
      pago: form.pago,
    })
    setSalvando(false)
    if (resultado?.error) setErro('Não foi possível salvar a despesa.')
  }

  return (
    <div className="modal-fundo">
      <form className="modal-card card" onSubmit={aoEnviar}>
        <h3>{despesaInicial ? 'Editar despesa' : 'Nova despesa'}</h3>

        <div className="campo">
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            value={form.descricao}
            onChange={(e) => atualizarCampo('descricao', e.target.value)}
            autoFocus
          />
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" value={form.tipo} onChange={(e) => atualizarCampo('tipo', e.target.value)}>
              <option value="empresa">Empresa</option>
              <option value="pessoal">Pessoal</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="valor">Valor (R$)</label>
            <input
              id="valor"
              type="number"
              step="0.01"
              value={form.valor}
              onChange={(e) => atualizarCampo('valor', e.target.value)}
            />
          </div>
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="categoria">Categoria</label>
            <input
              id="categoria"
              value={form.categoria ?? ''}
              onChange={(e) => atualizarCampo('categoria', e.target.value)}
              placeholder="Ex: Aluguel, Fornecedor..."
            />
          </div>

          <div className="campo">
            <label htmlFor="vencimento">Vencimento</label>
            <input
              id="vencimento"
              type="date"
              value={form.data_vencimento ?? ''}
              onChange={(e) => atualizarCampo('data_vencimento', e.target.value)}
            />
          </div>
        </div>

        <div className="campo campo-checkbox">
          <label htmlFor="pago">
            <input
              id="pago"
              type="checkbox"
              checked={form.pago}
              onChange={(e) => atualizarCampo('pago', e.target.checked)}
            />
            Já foi paga (lança saída no caixa)
          </label>
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <div className="modal-acoes">
          <button type="button" className="btn btn-secundario" onClick={aoCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primario" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
