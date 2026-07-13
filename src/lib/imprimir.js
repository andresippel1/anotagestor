// Injeta um @page temporário antes de imprimir, para que a mesma página
// possa imprimir tanto em térmica 58mm (comanda/comprovante) quanto em
// A4 (relatórios) sem que uma configuração vaze para a outra.
function imprimirComPagina(regraPagina) {
  const estilo = document.createElement('style')
  estilo.textContent = `@page { ${regraPagina} }`
  document.head.appendChild(estilo)

  const limpar = () => estilo.remove()
  window.addEventListener('afterprint', limpar, { once: true })
  window.addEventListener('afterprint', () => console.log('[imprimir] afterprint disparado'), { once: true })

  console.log('[imprimir] chamando window.print()...')
  try {
    window.print()
    console.log('[imprimir] window.print() retornou sem erro')
  } catch (erro) {
    // Se o navegador bloquear a impressão (ex: sem impressora padrão configurada,
    // spooler do Windows parado), isso evita que o clique pareça "não fazer nada".
    console.error('[imprimir] falha ao abrir a janela de impressão:', erro)
    alert('Não foi possível abrir a impressão. Verifique se há uma impressora configurada no computador.')
  }

  // fallback caso o navegador não dispare afterprint (ex: alguns webviews mobile)
  setTimeout(limpar, 3000)
}

export function imprimirTermica() {
  document.body.classList.add('modo-impressao-termica')
  // Bobina de 58mm com área imprimível de 48mm: 5mm de margem de cada lado.
  imprimirComPagina('size: 58mm auto; margin: 5mm;')
  setTimeout(() => document.body.classList.remove('modo-impressao-termica'), 3000)
  window.addEventListener(
    'afterprint',
    () => document.body.classList.remove('modo-impressao-termica'),
    { once: true }
  )
}

export function imprimirA4() {
  imprimirComPagina('size: A4; margin: 14mm;')
}
