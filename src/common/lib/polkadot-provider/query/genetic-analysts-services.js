export async function queryGetAllGeneticAnalystServices(api) {
  const res = await api.query.geneticAnalystServices.geneticAnalystServices.entries()
  return res
}
