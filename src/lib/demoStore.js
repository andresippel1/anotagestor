// Dados de exemplo em memória usados só quando VITE_MODO_DEMO=true.
// Somem ao recarregar a página. Servem para navegar nas telas sem Supabase.
import { EMPRESA_DEMO } from '../modules/auth/demoData'

function uid() {
  return crypto.randomUUID()
}

export function agora() {
  return new Date().toISOString()
}

const idEspetoCarne = uid()
const idEspetoFrango = uid()
const idRefrigerante = uid()

export const demoStore = {
  estoque_itens: [
    { id: uid(), empresa_id: EMPRESA_DEMO.id, nome: 'Carne bovina', categoria: 'Carnes', unidade: 'kg', quantidade: 12, quantidade_minima: 5, custo_unitario: 32, created_at: agora(), updated_at: agora() },
    { id: uid(), empresa_id: EMPRESA_DEMO.id, nome: 'Pão de espeto', categoria: 'Padaria', unidade: 'un', quantidade: 40, quantidade_minima: 20, custo_unitario: 1.2, created_at: agora(), updated_at: agora() },
    { id: uid(), empresa_id: EMPRESA_DEMO.id, nome: 'Carvão', categoria: 'Insumos', unidade: 'kg', quantidade: 3, quantidade_minima: 5, custo_unitario: 8, created_at: agora(), updated_at: agora() },
    { id: uid(), empresa_id: EMPRESA_DEMO.id, nome: 'Copo descartável', categoria: 'Descartáveis', unidade: 'un', quantidade: 0, quantidade_minima: 50, custo_unitario: 0.15, created_at: agora(), updated_at: agora() },
  ],
  produtos: [
    { id: idEspetoCarne, empresa_id: EMPRESA_DEMO.id, nome: 'Espeto de carne', categoria: 'Espetos', preco_venda: 12, preco_custo: 6, controla_estoque: true, estoque_item_id: null, ativo: true, created_at: agora() },
    { id: idEspetoFrango, empresa_id: EMPRESA_DEMO.id, nome: 'Espeto de frango', categoria: 'Espetos', preco_venda: 10, preco_custo: 5, controla_estoque: true, estoque_item_id: null, ativo: true, created_at: agora() },
    { id: idRefrigerante, empresa_id: EMPRESA_DEMO.id, nome: 'Refrigerante lata', categoria: 'Bebidas', preco_venda: 6, preco_custo: 2.5, controla_estoque: false, estoque_item_id: null, ativo: true, created_at: agora() },
  ],
  mesas: [
    { id: uid(), empresa_id: EMPRESA_DEMO.id, numero: '1', status: 'livre', aberta_em: null, fechada_em: null, created_at: agora() },
    { id: uid(), empresa_id: EMPRESA_DEMO.id, numero: '2', status: 'livre', aberta_em: null, fechada_em: null, created_at: agora() },
    { id: uid(), empresa_id: EMPRESA_DEMO.id, numero: '3', status: 'livre', aberta_em: null, fechada_em: null, created_at: agora() },
  ],
  comanda_itens: [],
  vendas: [],
  despesas: [
    { id: uid(), empresa_id: EMPRESA_DEMO.id, descricao: 'Aluguel do ponto', categoria: 'Fixa', tipo: 'empresa', valor: 1200, data_vencimento: null, pago: true, created_at: agora() },
    { id: uid(), empresa_id: EMPRESA_DEMO.id, descricao: 'Gás de cozinha', categoria: 'Insumo', tipo: 'empresa', valor: 180, data_vencimento: null, pago: false, created_at: agora() },
  ],
  caixa_movimentos: [
    { id: uid(), empresa_id: EMPRESA_DEMO.id, tipo: 'entrada', origem: 'manual', origem_id: null, valor: 500, descricao: 'Abertura de caixa', created_at: agora(), caixa_sessao_id: null },
  ],
  caixa_sessoes: [],
  clientes: [
    { id: uid(), empresa_id: EMPRESA_DEMO.id, nome: 'Cliente Exemplo', telefone: '(11) 99999-0000', email: '', endereco: '', observacoes: '', created_at: agora() },
  ],
  empresas: [{ ...EMPRESA_DEMO, created_at: agora(), data_expiracao_trial: null }],
  usuarios_empresa: [],
}

export function novoId() {
  return uid()
}
