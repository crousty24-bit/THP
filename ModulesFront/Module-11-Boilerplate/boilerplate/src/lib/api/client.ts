import { ApiError } from '@/lib/api/errors'
import type {
  ApiMethod,
  ApiRequestOptions,
  ApiRequestOptionsWithBody,
} from '@/lib/api/types'
import { env } from '@/lib/env/env'

function buildUrl(path: string, query?: ApiRequestOptions['query']) {
  const url = new URL(path, `${env.apiBaseUrl}/`)

  if (!query) {
    return url
  }

  const params = query instanceof URLSearchParams ? query : new URLSearchParams()

  if (!(query instanceof URLSearchParams)) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.set(key, String(value))
      }
    })
  }

  params.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  return url
}

async function parseResponse(response: Response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const record = payload as Record<string, unknown>
  const nestedError = record.error as Record<string, unknown> | undefined

  return String(nestedError?.message || record.message || fallback)
}

async function request<T>(
  method: ApiMethod,
  path: string,
  options: ApiRequestOptionsWithBody = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  const response = await fetch(buildUrl(path, options.query), {
    method,
    headers,
    signal: options.signal,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  const payload = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
    )
  }

  return payload as T
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>('DELETE', path, options),
}
