import { useState } from 'react'
import { useNotificacoes } from '../modules/notificacoes/useNotificacoes'
import './NotificacoesSino.css'

export default function NotificacoesSino() {
  const [aberto, setAberto] = useState(false)
  const { notificacoes, carregando } = useNotificacoes()

  return (
    <div className="notificacoes-wrap">
      <button
        className="topbar-sino"
        onClick={() => setAberto((atual) => !atual)}
        aria-label="Notificações"
      >
        🔔
        {notificacoes.length > 0 && <span className="notificacoes-contador">{notificacoes.length}</span>}
      </button>

      {aberto && (
        <>
          <div className="notificacoes-overlay" onClick={() => setAberto(false)} />
          <div className="notificacoes-painel">
            <h4>Notificações</h4>
            {carregando ? (
              <p className="notificacoes-vazio">Carregando...</p>
            ) : notificacoes.length === 0 ? (
              <p className="notificacoes-vazio">Nenhuma notificação no momento.</p>
            ) : (
              <ul>
                {notificacoes.map((n) => (
                  <li key={n.id} className={`notificacoes-item tom-${n.tom}`}>
                    <strong>{n.titulo}</strong>
                    <span>{n.mensagem}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
