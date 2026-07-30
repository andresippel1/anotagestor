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

export default function MesaCard({ mesa, aoAbrir, aoLiberar, aoContinuar, aoReabrir }) {
  return (
    <div className={`mesa-card mesa-${mesa.status}`}>
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
