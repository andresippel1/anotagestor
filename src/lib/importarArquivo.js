function dividirLinhaCsv(linha) {
  const campos = []
  let atual = ''
  let dentroAspas = false

  for (let i = 0; i < linha.length; i++) {
    const char = linha[i]
    if (char === '"') {
      dentroAspas = !dentroAspas
    } else if ((char === ';' || char === ',') && !dentroAspas) {
      campos.push(atual.trim())
      atual = ''
    } else {
      atual += char
    }
  }
  campos.push(atual.trim())
  return campos
}

// Lê um .csv (exportado do Excel ou de outro sistema) e devolve
// um array de objetos usando a primeira linha como cabeçalho.
export function lerArquivoCsv(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = () => {
      const texto = String(leitor.result).replace(/^﻿/, '')
      const linhas = texto.split(/\r?\n/).filter((linha) => linha.trim() !== '')
      if (linhas.length < 2) return resolve([])

      const cabecalhos = dividirLinhaCsv(linhas[0]).map((c) => c.toLowerCase())
      const registros = linhas.slice(1).map((linha) => {
        const valores = dividirLinhaCsv(linha)
        const registro = {}
        cabecalhos.forEach((chave, indice) => {
          registro[chave] = valores[indice] ?? ''
        })
        return registro
      })
      resolve(registros)
    }
    leitor.onerror = reject
    leitor.readAsText(arquivo, 'utf-8')
  })
}
