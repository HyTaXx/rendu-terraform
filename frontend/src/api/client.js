const baseURL = import.meta.env.VITE_API_BASE_URL || ''

async function http(path, options = {}) {
  const url = `${baseURL}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }
  return res.json()
}

export function getTopCryptos() {
  return http('/cryptos')
}

export function getHistory(crypto) {
  return http(`/history/${encodeURIComponent(crypto)}`)
}

