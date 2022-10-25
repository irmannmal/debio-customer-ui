export async function getActiveSubscriptionByOwner(api, accountId) {
  const res = await api.query.menstrualSubscription.activeSubscriptionByOwner(accountId)
  return res.toHuman()
}

export async function getMenstrualSubscriptionById(api, id) {
  const res = await api.query.menstrualSubscription.menstrualSubscriptionById(id)
  return res.toHuman()
}

export async function getMenstrualSubscriptionByOwner(api, accountId) {
  const res = await api.query.menstrualSubscription.menstrualSubscriptionByOwner(accountId)
  return res.toHuman()
} 

export async function getMenstrualSubscriptionPrices(api, duration, currency) {
  const res = await api.query.menstrualSubscription.menstrualSubscriptionPrices(duration, currency)
  return res.toHuman()
} 

