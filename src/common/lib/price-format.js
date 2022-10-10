import store from "@/store"
const web3 = store.getters["metamask/getWeb3"]

export function formatPrice(price, currency) {
  let unit
  currency === "USDT" ? unit = "mwei" : unit = "ether"
  const formatedPrice = web3.utils.fromWei(String(price.replaceAll(",", "")), unit)
  return Number(formatedPrice).toLocaleString("en-US")
}
