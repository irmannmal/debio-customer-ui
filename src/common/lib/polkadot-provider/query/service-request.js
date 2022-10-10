export async function queryGetServiceOfferById(api, id) {
  const res = await api.query.serviceRequest.serviceOfferById(id)
  return res.toHuman()
}
