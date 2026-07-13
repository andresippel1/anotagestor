import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as estoqueApi from '../estoque/estoqueApi'
import '../estoque/EstoqueFormulario.css'

export default function ProdutoFormulario({ produtoInicial, aoSalvar, aoCancelar }) {
  const { empresa } = useAuth()
  const [form, setForm] = useState(
    produtoInicial ?? {
      nome: '',
      categoria: '',
      preco_venda: 0,
      preco_custo: 0,
      controla_estoque: false,
      estoque_item_id: null,
      ativo: true,
    }
  )
  const [itensEstoque, setItensEstoque] = useState([])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!empresa?.id) return
    estoqueApi.listarItens(empresa.id).then(({ data }) => setItensEstoque(data ?? []))
  }, [empresa?.id])

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function aoEnviar(e) {
    e.preventDefault()
    if (!form.nome.trim()) {
      setErro('Informe o nome do produto.')
      return
    }
    setErro('')
    setSalvando(true)
    const resultado = await aoSalvar({
      nome: form.nome.trim(),
      categoria: form.categoria?.trim() || null,
      preco_venda: Number(form.preco_venda),
      preco_custo: Number(form.preco_custo),
      controla_estoque: form.controla_estoque,
      estoque_item_id: form.controla_estoque ? form.estoque_item_id || null : null,
      ativo: form.ativo,
    })
    setSalvando(false)
    if (resultado?.error) setErro('Não foi possível salvar o produto.')
  }

  return (
    <div className="modal-fundo">
      <form className="modal-card card" onSubmit={aoEnviar}>
        <h3>{produtoInicial ? 'Editar produto' : 'Novo produto'}</h3>

        <div className="campo">
          <label htmlFor="nome">Nome do produto</label>
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
            placeholder="Ex: Lanches, Bebidas, Espetos..."
          />
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="precoVenda">Preço de venda (R$)</label>
            <input
              id="precoVenda"
              type="number"
              step="0.01"
              value={form.preco_venda}
              onChange={(e) => atualizarCampo('preco_venda', e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="precoCusto">Preço de custo (R$)</label>
            <input
              id="precoCusto"
              type="number"
              step="0.01"
              value={form.preco_custo}
              onChange={(e) => atualizarCampo('preco_custo', e.target.value)}
            />
          </div>
        </div>

        <div className="campo campo-checkbox">
          <label htmlFor="controlaEstoque">
            <input
              id="controlaEstoque"
              type="checkbox"
              checked={form.controla_estoque}
              onChange={(e) => atualizarCampo('controla_estoque', e.target.checked)}
            />
            Este produto controla estoque
          </label>
        </div>

        {form.controla_estoque && (
          <div className="campo">
            <label htmlFor="itemEstoque">Item de estoque vinculado</label>
            <select
              id="itemEstoque"
              value={form.estoque_item_id ?? ''}
              onChange={(e) => atualizarCampo('estoque_item_id', e.target.value || null)}
            >
              <option value="">Selecione...</option>
              {itensEstoque.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="campo campo-checkbox">
          <label htmlFor="ativo">
            <input
              id="ativo"
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => atualizarCampo('ativo', e.target.checked)}
            />
            Produto ativo (aparece no PDV)
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
