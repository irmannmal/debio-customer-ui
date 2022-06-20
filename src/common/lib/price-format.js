import store from "@/store"
const web3 = store.getters["metamask/getWeb3"]

export function formatPrice(price) {
  return parseFloat(web3.utils.fromWei(String(price.replaceAll(",", "")), "ether"))
}
