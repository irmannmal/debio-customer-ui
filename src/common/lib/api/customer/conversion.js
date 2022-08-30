import apiClientRequest from "@/common/lib/api"

export const getConversion = async (from, to) => {
  const { data } = await apiClientRequest.get("/conversion/cache", {
    params: {
      from, 
      to
    }
  })

  return data
}
