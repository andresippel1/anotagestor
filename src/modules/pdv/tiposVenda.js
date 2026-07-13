export const TIPOS_VENDA = [
  { valor: 'mesa', rotulo: 'Mesa' },
  { valor: 'delivery_whatsapp', rotulo: 'Delivery WhatsApp' },
  { valor: 'app_delivery', rotulo: 'App Delivery' },
  { valor: 'balcao', rotulo: 'Venda Balcão' },
]

export function rotuloTipoVenda(valor) {
  return TIPOS_VENDA.find((t) => t.valor === valor)?.rotulo ?? valor
}
