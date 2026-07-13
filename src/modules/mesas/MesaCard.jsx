import './MesaCard.css'

const ROTULOS = {
  livre: 'Livre',
  aberta: 'Aberta',
  fechada: 'Fechada',
}

export default function MesaCard({ mesa, aoAbrir, aoLiberar, aoContinuar }) {
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
        <button className="btn btn-primario mesa-btn-acao" onClick={() => aoContinuar(mesa)}>
          Ver comanda
        </button>
      )}

      {mesa.status === 'fechada' && (
        <button className="btn btn-secundario mesa-btn-acao" onClick={() => aoLiberar(mesa)}>
          Liberar mesa
        </button>
      )}
    </div>
  )
}
