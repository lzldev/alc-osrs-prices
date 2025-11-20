const defaultHeaders = new Headers()

defaultHeaders.set(
  'User-Agent',
  'prices.bocchi.pink - @euquerococada on Discord'
)

export function apiFetch(url: string | URL, options?: RequestInit) {
  return fetch(url, { ...options, headers: defaultHeaders })
}

export function getMapping() {
  apiFetch(`osrsBaseUrl`)
}
