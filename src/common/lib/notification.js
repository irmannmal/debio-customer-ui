/* eslint-disable camelcase */
import localStorage from "./local-storage"
import { getNotifications } from "./api"
import store from "@/store"
import { fmtReferenceFromHex } from "./string-format"

const routes = {
  "Order Created": "customer-payment-details",
  "Order Fulfilled": "my-test",
  "Requested Service Available": "my-test",
  "Order Refunded": "",
  "Requested Service Created": "my-test"
}

export async function getUnlistedNotification (end_block, start_block) {

  const from = "Debio Network"
  const toId = localStorage.getAddress()

  if (!toId) return  
  
  const { data } = await getNotifications({ toId, start_block, end_block, from })

  const storageName = `LOCAL_NOTIFICATION_BY_ADDRESS_${toId}_customer`

  let tempNotification = []
  const currentNotifications = localStorage.getLocalStorageByName(storageName)

  if (!currentNotifications) localStorage.setLocalStorageByName(storageName, JSON.stringify(tempNotification))

  for (const event of data) {
    const { id, block_number, read, created_at, description, entity, reference_id } = event

    const dateSet = new Date(created_at)
    const timestamp = dateSet.getTime().toString()
    const notifDate = dateSet.toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      year: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric"
    })

    const referenceFormater = event?.reference_id?.includes("0x")
      ? `${fmtReferenceFromHex(event?.reference_id)}`
      : reference_id

    const message = description.replace("[]", referenceFormater)

    tempNotification.push({
      message,
      id,
      timestamp,
      route: routes[entity],
      params: reference_id,
      block: block_number,
      read,
      notifDate
    })
  }

  localStorage.setLocalStorageByName(storageName, JSON.stringify(tempNotification.reverse()))
  store.commit("substrate/SET_LIST_NOTIFICATION", tempNotification.reverse())
}
