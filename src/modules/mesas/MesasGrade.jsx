import MesaCard from './MesaCard'
import './MesasGrade.css'

export default function MesasGrade({ mesas, aoAbrir, aoLiberar, aoContinuar }) {
  if (mesas.length === 0) {
    return <p className="mesas-vazio">Nenhuma mesa cadastrada ainda. Crie a primeira mesa.</p>
  }

  return (
    <div className="mesas-grade">
      {mesas.map((mesa) => (
        <MesaCard
          key={mesa.id}
          mesa={mesa}
          aoAbrir={aoAbrir}
          aoLiberar={aoLiberar}
          aoContinuar={aoContinuar}
        />
      ))}
    </div>
  )
}
