function successCallback(api, { events, status, callback, unsub }) {
  if (status.isFinalized) {
    // Filter for success events
    const eventList = events.filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event));
    if (eventList.length > 0) {
      if (callback) callback(); // If callback not undefined
      unsub();
    }
  }
}

export async function addMenstrualCalendar(api, pair, averageCycle, callback) {
  let unsub = await api.tx.menstrualCalendar.addMenstrualCalendar(averageCycle).signAndSend(
    pair, 
    { nonce: -1},
    ({ events, status}) => {
      successCallback(api, { events, status, callback, unsub });
    }
  )
}

export async function addMenstrualCycleLog(api, pair, menstrualCalendarId, menstrualCalendarInfo, callback) {
  let unsub = await api.tx.menstrualCalendar.addMenstrualCycleLog(menstrualCalendarId, menstrualCalendarInfo).signAndSend(
    pair, 
    { nonce: -1},
    ({ events, status}) => {
      successCallback(api, { events, status, callback, unsub });
    }
  )
}

export async function updateMenstrualCalendar(api, pair, menstrualCalendarId, averageCycle, callback) {
  let unsub = await api.tx.menstrualCalendar.updateMenstrualCalendar(menstrualCalendarId, averageCycle).signAndSend(
    pair, 
    { nonce: -1},
    ({ events, status}) => {
      successCallback(api, { events, status, callback, unsub });
    }
  )
}

export async function updateMenstrualCycleLog(api, pair, cycleLog, callback) {
  let unsub = await api.tx.menstrualCalendar.updateMenstrualCycleLog(cycleLog).signAndSend(
    pair, 
    { nonce: -1},
    ({ events, status}) => {
      successCallback(api, { events, status, callback, unsub });
    }
  )
}
