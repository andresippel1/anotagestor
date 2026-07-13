import '../estoque/EstoqueFormulario.css'

export default function CredenciaisGeradas({ empresa, email, senha, aoFechar }) {
  function copiar() {
    const mensagem = `Olá, ${empresa.nome}! Seja bem-vindo ao Anota Gestor 🎉

Seu acesso já está liberado:

🔗 Acesso: ${window.location.origin}/login
📧 E-mail: ${email}
🔑 Senha: ${senha}

Recomendo trocar a senha assim que entrar pela primeira vez.
Qualquer dúvida, me chama por aqui mesmo!`

    navigator.clipboard?.writeText(mensagem)
  }

  return (
    <div className="modal-fundo">
      <div className="modal-card card">
        <h3>Cliente cadastrado com sucesso</h3>
        <p>
          Envie esses dados para <strong>{empresa.nome}</strong> pelo canal que preferir (WhatsApp, e-mail etc.).
          Recomende que ele troque a senha no primeiro acesso.
        </p>

        <div className="campo">
          <label>Link de acesso</label>
          <input readOnly value={`${window.location.origin}/login`} />
        </div>
        <div className="campo">
          <label>E-mail</label>
          <input readOnly value={email} />
        </div>
        <div className="campo">
          <label>Senha</label>
          <input readOnly value={senha} />
        </div>

        <div className="modal-acoes">
          <button type="button" className="btn btn-secundario" onClick={copiar}>
            Copiar dados
          </button>
          <button type="button" className="btn btn-primario" onClick={aoFechar}>
            Concluir
          </button>
        </div>
      </div>
    </div>
  )
}
