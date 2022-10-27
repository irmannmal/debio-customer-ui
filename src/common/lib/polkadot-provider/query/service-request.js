export async function queryGetServiceOfferById(api, id) {
  const res = await api.query.serviceRequest.requestById(id)
  return res.toHuman()
}
