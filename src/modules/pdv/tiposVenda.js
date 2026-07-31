export const TIPOS_VENDA = [
  { valor: 'mesa', rotulo: 'Mesa' },
  {
    valor: 'delivery_whatsapp',
    rotulo: 'Pedido pelo WhatsApp',
    descricao: 'Pedido recebido na conversa',
    icone: '💬',
    classe: 'whatsapp',
  },
  {
    valor: 'app_delivery',
    rotulo: 'Aplicativo de delivery',
    descricao: 'iFood, Aiqfome e outros apps',
    icone: '📱',
    classe: 'delivery',
  },
  {
    valor: 'balcao',
    rotulo: 'Venda no balcão',
    descricao: 'Atendimento direto ao cliente',
    icone: '🛍️',
    classe: 'balcao',
  },
]

export function rotuloTipoVenda(valor) {
  return TIPOS_VENDA.find((t) => t.valor === valor)?.rotulo ?? valor
}
