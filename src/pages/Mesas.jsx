import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMesas } from '../modules/mesas/useMesas'
import MesasGrade from '../modules/mesas/MesasGrade'
import NovaMesaFormulario from '../modules/mesas/NovaMesaFormulario'
import './Mesas.css'

export default function Mesas() {
  const { mesas, carregando, erro, criarMesa, abrirMesa, liberarMesa } = useMesas()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const navigate = useNavigate()

  async function aoAbrir(mesa) {
    const { error } = await abrirMesa(mesa.id)
    if (!error) navigate(`/pdv?mesa=${mesa.id}`)
  }

  function aoContinuar(mesa) {
    navigate(`/pdv?mesa=${mesa.id}`)
  }

  async function aoLiberar(mesa) {
    await liberarMesa(mesa.id)
  }

  async function aoCriarMesa(numero) {
    const resultado = await criarMesa(numero)
    if (!resultado.error) setFormularioAberto(false)
    return resultado
  }

  return (
    <div>
      <div className="mesas-topo">
        <p>Toque em uma mesa para abrir, continuar a comanda ou liberar.</p>
        <button className="btn btn-primario" onClick={() => setFormularioAberto(true)}>
          + Nova mesa
        </button>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      {carregando ? (
        <p>Carregando mesas...</p>
      ) : (
        <MesasGrade
          mesas={mesas}
          aoAbrir={aoAbrir}
          aoLiberar={aoLiberar}
          aoContinuar={aoContinuar}
        />
      )}

      {formularioAberto && (
        <NovaMesaFormulario aoCriar={aoCriarMesa} aoCancelar={() => setFormularioAberto(false)} />
      )}
    </div>
  )
}
