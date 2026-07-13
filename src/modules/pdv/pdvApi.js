import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'
import { rotuloTipoVenda } from './tiposVenda'

function descricaoVenda(mesa, origemVenda) {
  return mesa ? `Venda - Mesa ${mesa.numero}` : `Venda - ${rotuloTipoVenda(origemVenda)}`
}

function comProduto(item) {
  const produto = demoStore.produtos.find((p) => p.id === item.produto_id)
  return { ...item, produtos: { nome: produto?.nome ?? 'Produto' } }
}

export async function buscarMesa(mesaId) {
  if (MODO_DEMO) {
    const mesa = demoStore.mesas.find((m) => m.id === mesaId)
    return { data: mesa, error: null }
  }
  return supabase.from('mesas').select('*').eq('id', mesaId).single()
}

export async function listarItensComanda(mesaId) {
  if (MODO_DEMO) {
    return {
      data: demoStore.comanda_itens.filter((i) => i.mesa_id === mesaId).map(comProduto),
      error: null,
    }
  }
  return supabase
    .from('comanda_itens')
    .select('*, produtos ( nome )')
    .eq('mesa_id', mesaId)
    .order('created_at', { ascending: true })
}

export async function adicionarItemComanda(empresaId, { mesaId, produto, quantidade = 1, observacao = null }) {
  if (MODO_DEMO) {
    const novo = {
      id: novoId(),
      empresa_id: empresaId,
      mesa_id: mesaId,
      produto_id: produto.id,
      quantidade,
      preco_unitario: produto.preco_venda,
      observacao,
      created_at: agora(),
    }
    demoStore.comanda_itens.push(novo)
    return { data: comProduto(novo), error: null }
  }
  return supabase
    .from('comanda_itens')
    .insert({
      empresa_id: empresaId,
      mesa_id: mesaId,
      produto_id: produto.id,
      quantidade,
      preco_unitario: produto.preco_venda,
      observacao,
    })
    .select('*, produtos ( nome )')
    .single()
}

export async function atualizarQuantidadeItem(itemId, quantidade) {
  if (MODO_DEMO) {
    const item = demoStore.comanda_itens.find((i) => i.id === itemId)
    item.quantidade = quantidade
    return { data: comProduto(item), error: null }
  }
  return supabase
    .from('comanda_itens')
    .update({ quantidade })
    .eq('id', itemId)
    .select('*, produtos ( nome )')
    .single()
}

export async function removerItemComanda(itemId) {
  if (MODO_DEMO) {
    demoStore.comanda_itens = demoStore.comanda_itens.filter((i) => i.id !== itemId)
    return { error: null }
  }
  return supabase.from('comanda_itens').delete().eq('id', itemId)
}

export async function finalizarVenda(empresaId, { mesaId = null, total, formaPagamento, origemVenda = 'mesa' }) {
  if (MODO_DEMO) {
    const mesa = mesaId ? demoStore.mesas.find((m) => m.id === mesaId) : null
    const venda = {
      id: novoId(),
      empresa_id: empresaId,
      mesa_id: mesaId,
      total,
      forma_pagamento: formaPagamento,
      origem_venda: origemVenda,
      status: 'concluida',
      created_at: agora(),
    }
    demoStore.vendas.push(venda)
    demoStore.caixa_movimentos.push({
      id: novoId(),
      empresa_id: empresaId,
      tipo: 'entrada',
      origem: 'venda',
      origem_id: venda.id,
      valor: total,
      descricao: descricaoVenda(mesa, origemVenda),
      created_at: agora(),
    })
    if (mesaId) {
      demoStore.comanda_itens = demoStore.comanda_itens.filter((i) => i.mesa_id !== mesaId)
      Object.assign(mesa, { status: 'fechada', fechada_em: agora() })
    }
    return { data: venda, error: null }
  }

  let mesa = null
  if (mesaId) {
    const { data } = await supabase.from('mesas').select('numero').eq('id', mesaId).single()
    mesa = data
  }

  const { data: venda, error: erroVenda } = await supabase
    .from('vendas')
    .insert({
      empresa_id: empresaId,
      mesa_id: mesaId,
      total,
      forma_pagamento: formaPagamento,
      origem_venda: origemVenda,
      status: 'concluida',
    })
    .select()
    .single()

  if (erroVenda) return { error: erroVenda }

  const { error: erroCaixa } = await supabase.from('caixa_movimentos').insert({
    empresa_id: empresaId,
    tipo: 'entrada',
    origem: 'venda',
    origem_id: venda.id,
    valor: total,
    descricao: descricaoVenda(mesa, origemVenda),
  })
  if (erroCaixa) return { error: erroCaixa }

  if (mesaId) {
    const { error: erroLimpeza } = await supabase.from('comanda_itens').delete().eq('mesa_id', mesaId)
    if (erroLimpeza) return { error: erroLimpeza }

    const { error: erroMesa } = await supabase
      .from('mesas')
      .update({ status: 'fechada', fechada_em: new Date().toISOString() })
      .eq('id', mesaId)

    if (erroMesa) return { error: erroMesa }
  }

  return { data: venda }
}
