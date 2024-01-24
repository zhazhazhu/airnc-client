interface Data {
  id: string
  ip: string
  link: string
  websocket_key: string
}
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const data = await $fetch('/api/client', { method: 'GET', baseURL: runtimeConfig.remote_host, query: { search: query.search } }).catch(() => []) as Data[]
  return data
})
