import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../modules/auth/AuthContext'
import { useMesas } from '../modules/mesas/useMesas'
import { useComanda } from '../modules/pdv/useComanda'
import { TIPOS_VENDA, rotuloTipoVenda } from '../modules/pdv/tiposVenda'
import SeletorProdutos from '../modules/pdv/SeletorProdutos'
import ComandaItemLinha from '../modules/pdv/ComandaItemLinha'
import ComandaCozinhaImpressao from '../modules/pdv/ComandaCozinhaImpressao'
import ComprovanteClienteImpressao from '../modules/pdv/ComprovanteClienteImpressao'
import FecharVendaModal from '../modules/pdv/FecharVendaModal'
import { imprimirTermica } from '../lib/imprimir'
import { formatMoeda } from '../lib/formatters'
import './PDV.css'

export default function PDV() {
  const [searchParams] = useSearchParams()
  const mesaId = searchParams.get('mesa')
  const origemVenda = searchParams.get('origem')
  const navigate = useNavigate()
  const { empresa, nomeUsuario } = useAuth()

  if (!mesaId && !origemVenda) return <SeletorInicial />

  return (
    <ComandaPDV
      mesaId={mesaId}
      origemVenda={mesaId ? 'mesa' : origemVenda}
      empresa={empresa}
      atendente={nomeUsuario}
      navigate={navigate}
    />
  )
}

function SeletorInicial() {
  const { mesas, carregando, abrirMesa } = useMesas()
  const navigate = useNavigate()
  const mesasDisponiveis = mesas.filter((m) => m.status !== 'fechada')
  const mesasAbertas = mesas.filter((m) => m.status === 'aberta').length

  async function selecionarLivre(mesa) {
    const { error } = await abrirMesa(mesa.id)
    if (!error) navigate(`/pdv?mesa=${mesa.id}`)
  }

  return (
    <div className="pdv-seletor-inicial">
      <div className="card pdv-seletor-tipos">
        <h3>Nova venda</h3>
        <div className="pdv-tipos-grade">
          {TIPOS_VENDA.filter((t) => t.valor !== 'mesa').map((tipo) => (
            <button
              key={tipo.valor}
              className="btn btn-secundario pdv-tipo-btn"
              onClick={() => navigate(`/pdv?origem=${tipo.valor}`)}
            >
              {tipo.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div className="card pdv-seletor-mesa">
        <h3>
          Ou selecione uma mesa
          {mesasAbertas > 0 && <span className="badge-mesas-abertas">{mesasAbertas} aberta(s)</span>}
        </h3>
        {carregando ? (
          <p>Carregando mesas...</p>
        ) : mesasDisponiveis.length === 0 ? (
          <p>
            Nenhuma mesa livre ou aberta. <Link to="/mesas">Cadastre uma mesa</Link> primeiro.
          </p>
        ) : (
          <div className="pdv-seletor-mesa-grade">
            {mesasDisponiveis.map((mesa) => (
              <button
                key={mesa.id}
                className="btn btn-secundario pdv-seletor-mesa-btn"
                onClick={() =>
                  mesa.status === 'livre' ? selecionarLivre(mesa) : navigate(`/pdv?mesa=${mesa.id}`)
                }
              >
                Mesa {mesa.numero}
                <span className="tag tag-alerta">{mesa.status}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ComandaPDV({ mesaId, origemVenda, empresa, atendente, navigate }) {
  const {
    mesa,
    itens,
    total,
    carregando,
    erro,
    adicionarProduto,
    alterarQuantidade,
    removerItem,
    fecharVenda,
  } = useComanda(mesaId, origemVenda)

  const [modalFecharAberto, setModalFecharAberto] = useState(false)
  const [modoImpressao, setModoImpressao] = useState(null) // 'cozinha' | 'cliente'
  const [vendaConcluida, setVendaConcluida] = useState(null)

  useEffect(() => {
    if (!modoImpressao) return
    imprimirTermica()
    const limpar = () => setModoImpressao(null)
    window.addEventListener('afterprint', limpar, { once: true })
    const timeout = setTimeout(limpar, 3000)
    return () => {
      window.removeEventListener('afterprint', limpar)
      clearTimeout(timeout)
    }
  }, [modoImpressao])

  async function aoRemover(item) {
    const confirmar = window.confirm(
      `Remover "${item.produtos?.nome ?? 'item'}" da comanda? Use isso para corrigir lançamento errado.`
    )
    if (!confirmar) return
    await removerItem(item)
  }

  async function aoConfirmarFechamento(formaPagamento) {
    const itensDaVenda = itens
    const totalDaVenda = total
    const resultado = await fecharVenda(formaPagamento)
    if (!resultado.error) {
      setModalFecharAberto(false)
      setVendaConcluida({
        itens: itensDaVenda,
        total: totalDaVenda,
        formaPagamento,
        numeroVenda: resultado.data?.id,
      })
    }
    return resultado
  }

  function continuarAposVenda() {
    setVendaConcluida(null)
    navigate(mesaId ? '/mesas' : '/pdv')
  }

  if (carregando) return <p>Carregando comanda...</p>

  if (vendaConcluida) {
    return (
      <>
        <div className="card pdv-venda-concluida no-imprimir">
          <h3>✅ Venda concluída — {formatMoeda(vendaConcluida.total)}</h3>
          <p>Forma de pagamento: {vendaConcluida.formaPagamento}</p>
          <div className="pdv-comanda-acoes">
            <button className="btn btn-secundario btn-bloco" onClick={() => setModoImpressao('cliente')}>
              🧾 Imprimir comprovante do cliente
            </button>
            <button className="btn btn-primario btn-bloco" onClick={continuarAposVenda}>
              Concluir
            </button>
          </div>
        </div>

        {modoImpressao === 'cliente' && (
          <ComprovanteClienteImpressao
            empresa={empresa}
            mesa={mesa}
            rotuloOrigem={!mesaId ? rotuloTipoVenda(origemVenda) : null}
            itens={vendaConcluida.itens}
            total={vendaConcluida.total}
            formaPagamento={vendaConcluida.formaPagamento}
            numeroVenda={vendaConcluida.numeroVenda}
          />
        )}
      </>
    )
  }

  return (
    <div className="pdv-tela">
      <div className="pdv-coluna pdv-coluna-produtos no-imprimir">
        <h3>{mesaId ? `Mesa ${mesa?.numero}` : rotuloTipoVenda(origemVenda)}</h3>
        <SeletorProdutos aoSelecionar={adicionarProduto} />
      </div>

      <div className="pdv-coluna pdv-coluna-comanda no-imprimir">
        <div className="card pdv-comanda-card">
          <h3>Comanda</h3>

          {erro && <div className="mensagem-erro">{erro}</div>}

          {itens.length === 0 ? (
            <p className="pdv-comanda-vazia">Nenhum item lançado ainda. Toque em um produto ao lado.</p>
          ) : (
            <div className="pdv-comanda-itens">
              {itens.map((item) => (
                <ComandaItemLinha
                  key={item.id}
                  item={item}
                  aoAlterarQuantidade={alterarQuantidade}
                  aoRemover={aoRemover}
                />
              ))}
            </div>
          )}

          <div className="pdv-comanda-total">
            <span>Total</span>
            <strong>{formatMoeda(total)}</strong>
          </div>

          <div className="pdv-comanda-acoes">
            <button
              className="btn btn-secundario btn-bloco"
              disabled={itens.length === 0}
              onClick={() => setModoImpressao('cozinha')}
            >
              🖨️ Imprimir comanda (cozinha)
            </button>
            <button
              className="btn btn-primario btn-bloco"
              disabled={itens.length === 0}
              onClick={() => setModalFecharAberto(true)}
            >
              Fechar venda
            </button>
          </div>
        </div>
      </div>

      {modalFecharAberto && (
        <FecharVendaModal
          total={total}
          aoConfirmar={aoConfirmarFechamento}
          aoCancelar={() => setModalFecharAberto(false)}
        />
      )}

      {modoImpressao === 'cozinha' && (
        <ComandaCozinhaImpressao
          empresa={empresa}
          mesa={mesa}
          rotuloOrigem={!mesaId ? rotuloTipoVenda(origemVenda) : null}
          itens={itens}
          atendente={atendente}
        />
      )}
    </div>
  )
}
