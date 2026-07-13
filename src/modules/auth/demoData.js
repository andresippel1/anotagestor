// Modo demo: login local sem depender do Supabase, só para navegar nas telas
// com dados de exemplo antes do banco de dados real estar conectado.
// Ativado via VITE_MODO_DEMO=true no .env. Remova essa variável quando
// o Supabase estiver configurado para usar autenticação real.

export const MODO_DEMO = import.meta.env.VITE_MODO_DEMO === 'true'

export const EMPRESA_DEMO = {
  id: 'demo-empresa-alphaville',
  nome: 'Alphaville',
  slug: 'alphaville',
  logo_url: null,
  cor_primaria: '#ff5a1f',
  cor_secundaria: '#0a0a0a',
  plano: 'pro',
  status_assinatura: 'ativo',
  endereco: '',
  telefone: '',
  instagram: '',
  whatsapp_contato: '',
  mensagem_personalizada: '',
  valor_mensalidade: 147,
  implantacao_paga: true,
  implantacao_valor: 300,
  implantacao_data: '2026-06-01',
  data_inicio_assinatura: '2026-06-01',
  data_termino_plano: null,
  documento: '',
  nome_responsavel: 'Thiago',
  cep: '',
  cidade: '',
}

// Dois acessos separados: você (acesso desenvolvedor, vê todas as empresas)
// e o Thiago (dono da Alphaville, só vê a empresa dele).
export const USUARIOS_DEMO = [
  {
    id: 'demo-usuario-andre',
    email: 'andre@anotagestor.com',
    senha: 'AnotaGestor@2026',
    nome: 'André',
    papel: 'super_admin',
  },
  {
    id: 'demo-usuario-thiago',
    email: 'thiago@alphaville.com',
    senha: 'alphaville123',
    nome: 'Thiago',
    papel: 'admin',
  },
]
