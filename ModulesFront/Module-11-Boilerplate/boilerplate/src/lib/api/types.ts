export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiRequestOptions = {
  headers?: HeadersInit
  query?: URLSearchParams | Record<string, string | number | boolean | null | undefined>
  token?: string | null
  signal?: AbortSignal
}

export type ApiRequestOptionsWithBody = ApiRequestOptions & {
  body?: unknown
}
