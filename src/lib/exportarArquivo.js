function paraCelulaCsv(valor) {
  const texto = String(valor ?? '')
  return /[",;\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
}

// Gera um .csv (abre direto no Excel) sem depender de nenhuma biblioteca externa.
export function exportarCsv(nomeArquivo, cabecalhos, linhas) {
  const conteudo = [cabecalhos, ...linhas]
    .map((linha) => linha.map(paraCelulaCsv).join(';'))
    .join('\r\n')

  const blob = new Blob(['﻿' + conteudo], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo.endsWith('.csv') ? nomeArquivo : `${nomeArquivo}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
