import apiClientRequest from "@/common/lib/api"

export async function walletBinding(payload) {
  const { data } = await apiClientRequest.post("/substrate/wallet-binding", payload)
  return data 
}
