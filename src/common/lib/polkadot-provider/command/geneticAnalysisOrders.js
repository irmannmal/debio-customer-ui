export async function setGeneticAnalysisPaid(api, pair, orderId) {
  const result = await api.tx.geneticAnalysisOrders
    .setGeneticAnalysisOrderPaid(orderId)
    .signAndSend(pair, { nonce: -1})
  return result.toHuman()
}
