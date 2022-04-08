export async function queryGeneticAnalysisOrderById(api, orderId) {
  const res = await api.query.geneticAnalysisOrders.geneticAnalysisOrders(orderId)
  return res.toHuman()
}

export async function queryLastGeneticAnalysisOrderByCustomer(api, accountId) {
  const res = await api.query.geneticAnalysisOrders.lastGeneticAnalysisOrderByCustomer(accountId)
  return res.toHuman()
}
