import './MesaCard.css'

const ROTULOS = {
  livre: 'Livre',
  aberta: 'Aberta',
  fechada: 'Fechada',
}

function aoLiberarComConfirmacao(mesa, aoLiberar) {
  const confirmar = window.confirm(
    `Liberar Mesa ${mesa.numero}? Isso limpa qualquer item lançado nela.`
  )
  if (confirmar) aoLiberar(mesa)
}

function aoEditarComPrompt(mesa, aoEditar) {
  const novoNumero = window.prompt('Novo nome/número da mesa:', mesa.numero)
  if (novoNumero && novoNumero.trim() && novoNumero.trim() !== mesa.numero) {
    aoEditar(mesa.id, novoNumero.trim())
  }
}

function aoExcluirComConfirmacao(mesa, aoExcluir) {
  const confirmar = window.confirm(
    `Excluir Mesa ${mesa.numero}? Essa ação não pode ser desfeita.`
  )
  if (confirmar) aoExcluir(mesa.id)
}

export default function MesaCard({ mesa, aoAbrir, aoLiberar, aoContinuar, aoReabrir, aoEditar, aoExcluir }) {
  return (
    <div className={`mesa-card mesa-${mesa.status}`}>
      <button
        type="button"
        className="mesa-btn-editar"
        title="Editar nome"
        onClick={() => aoEditarComPrompt(mesa, aoEditar)}
      >
        ✏️
      </button>
      <button
        type="button"
        className="mesa-btn-excluir"
        title="Excluir mesa"
        onClick={() => aoExcluirComConfirmacao(mesa, aoExcluir)}
      >
        🗑️
      </button>

      <span className="mesa-numero">Mesa {mesa.numero}</span>
      <span className="mesa-status">{ROTULOS[mesa.status]}</span>

      {mesa.status === 'livre' && (
        <button className="btn btn-primario mesa-btn-acao" onClick={() => aoAbrir(mesa)}>
          Abrir mesa
        </button>
      )}

      {mesa.status === 'aberta' && (
        <div className="mesa-acoes-duplas">
          <button className="btn btn-primario mesa-btn-acao" onClick={() => aoContinuar(mesa)}>
            Ver comanda
          </button>
          <button
            className="btn btn-secundario mesa-btn-acao"
            onClick={() => aoLiberarComConfirmacao(mesa, aoLiberar)}
          >
            Liberar mesa
          </button>
        </div>
      )}

      {mesa.status === 'fechada' && (
        <button className="btn btn-secundario mesa-btn-acao" onClick={() => aoReabrir(mesa)}>
          Abrir nova comanda
        </button>
      )}
    </div>
  )
}
