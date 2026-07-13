export function gerarSenhaTemporaria() {
  const caracteres = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let senha = ''
  for (let i = 0; i < 10; i++) {
    senha += caracteres[Math.floor(Math.random() * caracteres.length)]
  }
  return senha
}
