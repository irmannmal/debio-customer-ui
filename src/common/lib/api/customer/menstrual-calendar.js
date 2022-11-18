import apiClientRequest from "@/common/lib/api";
import localStorage from "@/common/lib/local-storage";

export async function getMensCalendarCycle(month, year) {
  const address = localStorage.getAddress()
  const { data } = await apiClientRequest.get(`substrate/menstrual-calendar-cycle/${address}/${month}/${year}`)
  return data
}
