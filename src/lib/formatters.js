export function formatMoeda(valor) {
  const numero = Number(valor) || 0
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatData(data) {
  if (!data) return '-'
  return new Date(data).toLocaleDateString('pt-BR')
}

export function formatDataHora(data) {
  if (!data) return '-'
  return new Date(data).toLocaleString('pt-BR')
}
