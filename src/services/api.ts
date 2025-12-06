import { BASE_URL } from '@/consts'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  params?: Record<string, string | number | undefined>
}

function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params } = options

  const url = buildUrl(endpoint, params)

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`
    try {
      const errorData = await response.json()
      if (errorData && typeof errorData === 'object') {
        // Fakestoreapi restituisce errori come stringa o oggetto
        if (typeof errorData === 'string') {
          errorMessage = errorData
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
      }
    } catch {
      // Se non riesce a parsare il JSON, usa il messaggio di default
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

