import apiClientRequest from "@/common/lib/api"
import store from "@/store/index"

/**
 * 
 * @param {String} country
 * @param {String} region
 * @param {String} city
 * @param {String} category
 * 
 */


export async function getServicesByCategory(category) {
  const { country, region, city} = store.getters["lab/getCountryRegionCity"]

  const params = {
    country,
    region,
    city,
    category
  }

  const { data : data } = await apiClientRequest.get("substrate/labs", { params })
  return data
}
