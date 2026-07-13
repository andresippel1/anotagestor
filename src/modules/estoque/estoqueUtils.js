const PRIORIDADE_STATUS = { sem_estoque: 0, baixo: 1, normal: 2 }

export function statusEstoque(item) {
  const quantidade = Number(item.quantidade)
  const minimo = Number(item.quantidade_minima)

  if (quantidade <= 0) return { chave: 'sem_estoque', rotulo: 'Sem Estoque', icone: '❌' }
  if (quantidade <= minimo) return { chave: 'baixo', rotulo: 'Estoque Baixo', icone: '⚠' }
  return { chave: 'normal', rotulo: 'Estoque Normal', icone: '✔' }
}

// Itens com estoque baixo ou zerado primeiro — usado no relatório e no alerta do dashboard.
export function ordenarPorStatus(itens) {
  return [...itens].sort((a, b) => {
    const prioridadeA = PRIORIDADE_STATUS[statusEstoque(a).chave]
    const prioridadeB = PRIORIDADE_STATUS[statusEstoque(b).chave]
    if (prioridadeA !== prioridadeB) return prioridadeA - prioridadeB
    return a.nome.localeCompare(b.nome)
  })
}

export function itensComEstoqueBaixo(itens) {
  return itens.filter((item) => statusEstoque(item).chave !== 'normal')
}
