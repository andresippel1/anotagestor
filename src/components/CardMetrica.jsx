import './CardMetrica.css'

export default function CardMetrica({ titulo, valor, tom = 'neutro', icone }) {
  return (
    <div className="card card-metrica">
      <span className={`card-metrica-badge tom-fundo-${tom}`}>{icone}</span>
      <span className="card-metrica-titulo">{titulo}</span>
      <strong className={`card-metrica-valor tom-${tom}`}>{valor}</strong>
    </div>
  )
}
