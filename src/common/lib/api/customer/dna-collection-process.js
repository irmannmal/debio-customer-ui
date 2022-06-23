import apiClientRequest from "@/common/lib/api"

export const getDNACollectionProcess = async () => {
  const { data: data } = await apiClientRequest.get("/dna-collection-process")
  return data
}
