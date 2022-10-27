import store from "@/store"

export async function createRequest(api, pair, country, region, city, category, price) {
  const web3 = store.getters["metamask/getWeb3"]
  const amount = web3.utils.toWei(String(price), "ether")
  const result = await api.tx.serviceRequest
    .createRequest(country, region, city, category, amount)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function processRequest(api, pair, requestId, orderId) {
  const result = await api.tx.serviceRequest
    .processRequest(requestId, orderId)
    .signAndSend(pair, { nonce: -1})
  return result.toHuman()
}
