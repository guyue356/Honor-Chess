interface Env {
  API_URL: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)

  // Target: Workers backend
  const targetBase = env.API_URL || 'https://honor-chess-api.YOUR_SUBDOMAIN.workers.dev'
  const targetUrl = new URL(url.pathname + url.search, targetBase)

  // Forward the request
  const newRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })

  // Add CORS headers to response
  const response = await fetch(newRequest)
  const newResponse = new Response(response.body, response)
  newResponse.headers.set('Access-Control-Allow-Origin', url.origin)
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  newResponse.headers.set('Access-Control-Max-Age', '86400')

  return newResponse
}
