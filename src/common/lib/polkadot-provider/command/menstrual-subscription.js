export async function addMenstrualSubscriptionFee(api, pair, duration, currency) {
  const result = await api.tx.menstrualSubscription
    .addMenstrualSubscription(duration, currency)
    .paymentInfo(pair)
  return result
}

export async function addMenstrualSubscription(api, pair, duration, currency) {
  const result = await api.tx.menstrualSubscription
    .addMenstrualSubscription(duration, currency)
    .signAndSend(pair, {nonce: -1})
  return result
}

export async function setMenstrualSubscriptionPaid(api, pair, menstrualSubscriptionId) {
  const result = await api.tx.menstrualSubscription
    .setMenstrualSubscriptionPaid(menstrualSubscriptionId)
    .signAndSend(pair, {nonce: -1})
  return result
}
