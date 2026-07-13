import { useState } from 'react'
import './EstoqueFormulario.css'

const UNIDADES = ['un', 'kg', 'g', 'l', 'ml', 'cx', 'pct']

export default function EstoqueFormulario({ itemInicial, aoSalvar, aoCancelar }) {
  const [form, setForm] = useState(
    itemInicial ?? {
      nome: '',
      categoria: '',
      unidade: 'un',
      quantidade: 0,
      quantidade_minima: 0,
      custo_unitario: 0,
    }
  )
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function aoEnviar(e) {
    e.preventDefault()
    if (!form.nome.trim()) {
      setErro('Informe o nome do item.')
      return
    }
    setErro('')
    setSalvando(true)
    const resultado = await aoSalvar({
      nome: form.nome.trim(),
      categoria: form.categoria?.trim() || null,
      unidade: form.unidade,
      quantidade: Number(form.quantidade),
      quantidade_minima: Number(form.quantidade_minima),
      custo_unitario: Number(form.custo_unitario),
    })
    setSalvando(false)
    if (resultado?.error) setErro('Não foi possível salvar o item.')
  }

  return (
    <div className="modal-fundo">
      <form className="modal-card card" onSubmit={aoEnviar}>
        <h3>{itemInicial ? 'Editar item' : 'Novo item de estoque'}</h3>

        <div className="campo">
          <label htmlFor="nome">Nome do item</label>
          <input
            id="nome"
            value={form.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)}
            autoFocus
          />
        </div>

        <div className="campo">
          <label htmlFor="categoria">Categoria</label>
          <input
            id="categoria"
            value={form.categoria ?? ''}
            onChange={(e) => atualizarCampo('categoria', e.target.value)}
            placeholder="Ex: Carnes, Bebidas, Descartáveis..."
          />
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="unidade">Unidade</label>
            <select
              id="unidade"
              value={form.unidade}
              onChange={(e) => atualizarCampo('unidade', e.target.value)}
            >
              {UNIDADES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="quantidade">Quantidade</label>
            <input
              id="quantidade"
              type="number"
              step="0.001"
              value={form.quantidade}
              onChange={(e) => atualizarCampo('quantidade', e.target.value)}
            />
          </div>
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="minima">Qtd. mínima</label>
            <input
              id="minima"
              type="number"
              step="0.001"
              value={form.quantidade_minima}
              onChange={(e) => atualizarCampo('quantidade_minima', e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="custo">Custo unitário (R$)</label>
            <input
              id="custo"
              type="number"
              step="0.01"
              value={form.custo_unitario}
              onChange={(e) => atualizarCampo('custo_unitario', e.target.value)}
            />
          </div>
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
