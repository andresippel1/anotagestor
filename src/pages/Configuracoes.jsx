import { useRef, useState } from 'react'
import { useAuth } from '../modules/auth/AuthContext'
import * as empresasApi from '../modules/empresas/empresasApi'
import { MODO_DEMO } from '../modules/auth/demoData'
import './Configuracoes.css'

export default function Configuracoes() {
  const { empresa, atualizarEmpresaLocal } = useAuth()
  const [form, setForm] = useState({
    nome: empresa?.nome ?? '',
    logo_url: empresa?.logo_url ?? '',
    cor_primaria: empresa?.cor_primaria ?? '#ff6b35',
    cor_secundaria: empresa?.cor_secundaria ?? '#0f1115',
    endereco: empresa?.endereco ?? '',
    telefone: empresa?.telefone ?? '',
    instagram: empresa?.instagram ?? '',
    whatsapp_contato: empresa?.whatsapp_contato ?? '',
    mensagem_personalizada: empresa?.mensagem_personalizada ?? '',
  })
  const [enviandoLogo, setEnviandoLogo] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const inputArquivoRef = useRef(null)

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
    aplicarPreviaCores({ ...form, [campo]: valor })
  }

  function aplicarPreviaCores(dados) {
    document.documentElement.style.setProperty('--cor-primaria', dados.cor_primaria)
    document.documentElement.style.setProperty('--cor-secundaria', dados.cor_secundaria)
  }

  async function aoEscolherArquivo(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return

    if (!arquivo.type.startsWith('image/')) {
      setErro('Selecione um arquivo de imagem (PNG, JPG ou SVG).')
      return
    }

    setErro('')
    setEnviandoLogo(true)

    if (MODO_DEMO) {
      setForm((atual) => ({ ...atual, logo_url: URL.createObjectURL(arquivo) }))
      setEnviandoLogo(false)
      return
    }

    const { data, error } = await empresasApi.enviarLogo(empresa.id, arquivo)
    setEnviandoLogo(false)

    if (error) {
      setErro('Não foi possível enviar a logo. Verifique se o bucket "logos" existe no Supabase.')
      return
    }

    setForm((atual) => ({ ...atual, logo_url: data.url }))
  }

  async function salvar(e) {
    e.preventDefault()
    setSalvando(true)
    setMensagem('')
    setErro('')

    if (MODO_DEMO) {
      atualizarEmpresaLocal(form)
      setSalvando(false)
      setMensagem('Configurações salvas (modo demo, só nesta sessão).')
      return
    }

    const { data, error } = await empresasApi.atualizarEmpresa(empresa.id, form)

    setSalvando(false)
    if (error) {
      setErro('Erro ao salvar configurações.')
      return
    }

    atualizarEmpresaLocal(data)
    setMensagem('Configurações salvas com sucesso.')
  }

  return (
    <div className="config-grid">
      <form className="card" onSubmit={salvar}>
        <h3>Identidade visual da empresa</h3>

        <div className="campo">
          <label htmlFor="nome">Nome da empresa</label>
          <input id="nome" value={form.nome} onChange={(e) => atualizarCampo('nome', e.target.value)} />
        </div>

        <div className="campo">
          <label>Logo</label>
          <div className="config-logo-upload">
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => inputArquivoRef.current?.click()}
              disabled={enviandoLogo}
            >
              {enviandoLogo ? 'Enviando...' : '📤 Enviar arquivo de logo'}
            </button>
            <input
              ref={inputArquivoRef}
              type="file"
              accept="image/*"
              hidden
              onChange={aoEscolherArquivo}
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="logo">Ou cole a URL da logo</label>
          <input
            id="logo"
            value={form.logo_url}
            onChange={(e) => atualizarCampo('logo_url', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="linha-campos-cores">
          <div className="campo">
            <label htmlFor="corPrimaria">Cor primária</label>
            <input
              id="corPrimaria"
              type="color"
              value={form.cor_primaria}
              onChange={(e) => atualizarCampo('cor_primaria', e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="corSecundaria">Cor secundária</label>
            <input
              id="corSecundaria"
              type="color"
              value={form.cor_secundaria}
              onChange={(e) => atualizarCampo('cor_secundaria', e.target.value)}
            />
          </div>
        </div>

        <h3 style={{ marginTop: '1.5rem' }}>Contato e atendimento</h3>

        <div className="campo">
          <label htmlFor="endereco">Endereço</label>
          <input
            id="endereco"
            value={form.endereco}
            onChange={(e) => atualizarCampo('endereco', e.target.value)}
            placeholder="Rua, número, bairro, cidade"
          />
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              value={form.telefone}
              onChange={(e) => atualizarCampo('telefone', e.target.value)}
              placeholder="(11) 99999-0000"
            />
          </div>

          <div className="campo">
            <label htmlFor="whatsappContato">WhatsApp</label>
            <input
              id="whatsappContato"
              value={form.whatsapp_contato}
              onChange={(e) => atualizarCampo('whatsapp_contato', e.target.value)}
              placeholder="(11) 99999-0000"
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="instagram">Instagram</label>
          <input
            id="instagram"
            value={form.instagram}
            onChange={(e) => atualizarCampo('instagram', e.target.value)}
            placeholder="@sua_empresa"
          />
        </div>

        <div className="campo">
          <label htmlFor="mensagemPersonalizada">Mensagem personalizada (aparece na comanda/recibo)</label>
          <textarea
            id="mensagemPersonalizada"
            rows={3}
            value={form.mensagem_personalizada}
            onChange={(e) => atualizarCampo('mensagem_personalizada', e.target.value)}
            placeholder="Ex: Obrigado pela preferência! Volte sempre."
          />
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}
        {mensagem && <p className="config-mensagem-ok">{mensagem}</p>}

        <button type="submit" className="btn btn-primario btn-bloco" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </form>

      <div className="card config-preview">
        <h3>Prévia</h3>
        <div className="config-preview-topo">
          {form.logo_url ? (
            <img src={form.logo_url} alt="Logo da empresa" className="config-preview-logo" />
          ) : (
            <div className="config-preview-logo-placeholder">
              {form.nome?.[0]?.toUpperCase() ?? 'M'}
            </div>
          )}
          <strong>{form.nome || 'Nome da empresa'}</strong>
        </div>

        <button type="button" className="btn btn-primario btn-bloco">
          Botão de exemplo
        </button>
        <span className="tag tag-sucesso" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
          Estas cores já foram aplicadas no menu lateral
        </span>
      </div>
    </div>
  )
}
