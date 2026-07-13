import { useAuth } from '../auth/AuthContext'
import { useEstoque } from '../estoque/useEstoque'
import { useEmpresas } from '../empresas/useEmpresas'
import { itensComEstoqueBaixo } from '../estoque/estoqueUtils'

function diasAteVencimento(dataTermino) {
  if (!dataTermino) return null
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const termino = new Date(`${dataTermino}T00:00:00`)
  return Math.round((termino - hoje) / 86400000)
}

function alertasDeAssinaturas(empresas) {
  const alertas = []

  empresas.forEach((empresa) => {
    if (empresa.status_assinatura === 'atrasado') {
      alertas.push({ id: `${empresa.id}-atrasado`, titulo: empresa.nome, mensagem: 'Assinatura atrasada', tom: 'erro' })
    }
    if (empresa.status_assinatura === 'cancelado') {
      alertas.push({ id: `${empresa.id}-cancelado`, titulo: empresa.nome, mensagem: 'Assinatura cancelada', tom: 'erro' })
    }

    const dias = diasAteVencimento(empresa.data_termino_plano)
    if (dias !== null && dias <= 7) {
      alertas.push({
        id: `${empresa.id}-venc`,
        titulo: empresa.nome,
        mensagem: dias < 0 ? 'Plano vencido' : dias === 0 ? 'Plano vence hoje' : `Plano vence em ${dias} dia(s)`,
        tom: dias < 0 ? 'erro' : 'alerta',
      })
    }
  })

  return alertas
}

function alertasDeEstoque(itens) {
  return itensComEstoqueBaixo(itens).map((item) => ({
    id: item.id,
    titulo: item.nome,
    mensagem: `Estoque baixo: ${item.quantidade} ${item.unidade}`,
    tom: item.quantidade <= 0 ? 'erro' : 'alerta',
  }))
}

// Desenvolvedor vê assinaturas atrasadas/vencendo de todos os clientes;
// cada cliente vê o estoque baixo do próprio negócio.
export function useNotificacoes() {
  const { papel } = useAuth()
  const ehDesenvolvedor = papel === 'super_admin'

  const { itens, carregando: carregandoEstoque } = useEstoque()
  const { empresas, carregando: carregandoEmpresas } = useEmpresas()

  if (ehDesenvolvedor) {
    return { notificacoes: alertasDeAssinaturas(empresas), carregando: carregandoEmpresas }
  }

  return { notificacoes: alertasDeEstoque(itens), carregando: carregandoEstoque }
}
