export async function getLastMenstrualCalendarByOwner(api, ownerId) {
  const res = await api.query.menstrualCalendar.menstrualCalendarByOwner(ownerId)
  return res.toHuman()
}

export async function getMenstrualCalendarById(api, id) {
  const res = await api.query.menstrualCalendar.menstrualCalendarById(id)
  return res.toHuman()
}

export async function getLastMenstrualCalendarCycleLogByOwner(api, menstrualCalendarId) {
  const res = await api.query.menstrualCalendar.menstrualCycleLogByOwner(menstrualCalendarId)
  return res.toHuman()
}

export async function getMenstrualCycleLog(api, id) {
  const res = await api.query.menstrualCalendar.menstrualCycleLogById(id)
  return res.toHuman()
}
