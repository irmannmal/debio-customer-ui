export async function setGeneticAnalysisPaid(api, pair, orderId) {
  const result = await api.tx.geneticAnalysisOrders
    .setGeneticAnalysisOrderPaid(orderId)
    .signAndSend(pair, { nonce: -1})
  return result.toHuman()
}

export async function createGeneticAnalysisOrder(api, pair, geneticDataId, serviceId, priceIndex, publicKey, geneticLink, assetId) {
  const result = await api.tx.geneticAnalysisOrders
    .createGeneticAnalysisOrder(geneticDataId, serviceId, priceIndex, publicKey, geneticLink, assetId)
    .signAndSend(pair, {nonce: -1})
  return result
}

export async function createGeneticAnalysisOrderFee(api, pair, geneticDataId, serviceId, priceIndex, publicKey, geneticLink, assetId) {
  return await api.tx.geneticAnalysisOrders
    .createGeneticAnalysisOrder(geneticDataId, serviceId, priceIndex, publicKey, geneticLink, assetId)
    .paymentInfo(pair)
}
