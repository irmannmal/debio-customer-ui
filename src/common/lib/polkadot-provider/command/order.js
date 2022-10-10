export async function createOrder(api, pair, serviceId, indexPrice, customerBoxPublicKey, flow, assetId) {
  const result = await api.tx.orders
    .createOrder(serviceId, indexPrice, customerBoxPublicKey, flow, assetId)
    .signAndSend(pair, {nonce: -1})
  return result.toHuman()
}

export async function setOrderPaid(api, pair, orderId) {
  const result = await api.tx.orders
    .setOrderPaid(orderId)
    .signAndSend(pair, {nonce: -1})
  return result.toHuman()
}

export async function setOrderPaidFee(api, pair, orderId) {
  const result = await api.tx.orders
    .setOrderPaid(orderId)
    .paymentInfo(pair)
  return result
}
