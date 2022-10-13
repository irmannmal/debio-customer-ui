export async function getLastMenstrualCalendarByOwner(api, ownerId) {
  const res = await api.query.menstrualCalendar.menstrualCalendarByOwner(ownerId)
  return res.toHuman()
}

export async function getMenstrualCalendarById(api, id) {
  const res = await api.query.menstrualCalendar.menstrualCalendarById(id)
  return res.toHuman()
}

export async function getLastMenstrualCalendarCycleLogByOwner(api, ownerId) {
  const res = await api.query.menstrualCalendar.menstrualCycleLogByOwner(ownerId)
  return res.toHuman()
}
