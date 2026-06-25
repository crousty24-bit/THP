import type { AuthPayload, Post, UserProfile } from '@/types'

const DEFAULT_API_BASE_URL = 'http://localhost:1337/api'

const API_BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
).replace(/\/$/, '')

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  token?: string | null
  body?: unknown
  query?: URLSearchParams
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getApiErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const record = payload as Record<string, unknown>
  const error = record.error as Record<string, unknown> | undefined

  return String(error?.message || record.message || fallback)
}

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`)

  if (options.query) {
    options.query.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
  }

  const headers = new Headers()

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  let response: Response

  try {
    response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError(
      'Unable to reach the Shmeeter API. Start the server on localhost:1337 or set VITE_API_BASE_URL.',
      0,
    )
  }

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new ApiError(
      getApiErrorMessage(payload, `Request failed with ${response.status}`),
      response.status,
    )
  }

  return payload as T
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function unwrapData(value: unknown) {
  const record = asRecord(value)

  return 'data' in record ? record.data : value
}

export function normalizeUser(value: unknown): UserProfile {
  const raw = asRecord(unwrapData(value))
  const attributes = asRecord(raw.attributes)
  const source = Object.keys(attributes).length > 0 ? attributes : raw

  return {
    id: Number(raw.id || source.id || 0),
    username: String(source.username || ''),
    email: source.email ? String(source.email) : undefined,
    description:
      source.description === null || source.description === undefined
        ? null
        : String(source.description),
    provider: source.provider ? String(source.provider) : undefined,
    confirmed: typeof source.confirmed === 'boolean' ? source.confirmed : undefined,
    blocked: typeof source.blocked === 'boolean' ? source.blocked : undefined,
    createdAt: String(source.createdAt || source.created_at || ''),
    updatedAt: String(source.updatedAt || source.updated_at || ''),
  }
}

function normalizeUsers(value: unknown): UserProfile[] {
  const data = unwrapData(value)

  if (!Array.isArray(data)) {
    return []
  }

  return data.map(normalizeUser).filter((user) => user.id && user.username)
}

function getRelationArray(value: unknown) {
  const data = unwrapData(value)

  return Array.isArray(data) ? data : []
}

export function normalizePost(value: unknown): Post {
  const raw = asRecord(unwrapData(value))
  const attributes = asRecord(raw.attributes)
  const source = Object.keys(attributes).length > 0 ? attributes : raw
  const authorSource = source.author || source.user
  const likedUsers = getRelationArray(source.users_likes || source.usersLikes)
  const like = Number(source.like ?? source.likes ?? 0)

  return {
    id: Number(raw.id || source.id || 0),
    text: String(source.text || ''),
    like: Number.isFinite(like) ? like : 0,
    modified: Boolean(source.modified),
    createdAt: String(source.createdAt || source.created_at || ''),
    updatedAt: String(source.updatedAt || source.updated_at || ''),
    author: authorSource ? normalizeUser(authorSource) : null,
    likedUserIds: likedUsers
      .map((user) => normalizeUser(user).id)
      .filter((id) => Number.isFinite(id) && id > 0),
  }
}

function normalizePosts(value: unknown): Post[] {
  const data = unwrapData(value)

  if (!Array.isArray(data)) {
    return []
  }

  return data.map(normalizePost).filter((post) => post.id)
}

function normalizeAuthPayload(value: unknown): AuthPayload {
  const record = asRecord(value)

  return {
    jwt: String(record.jwt || ''),
    user: normalizeUser(record.user),
  }
}

function postsQuery(limit = 30) {
  return new URLSearchParams({
    'pagination[limit]': String(limit),
    populate: '*',
    'sort[0]': 'createdAt:desc',
  })
}

export function login(identifier: string, password: string) {
  return apiFetch<unknown>('/auth/local', {
    method: 'POST',
    body: { identifier, password },
  }).then(normalizeAuthPayload)
}

export function register(username: string, email: string, password: string) {
  return apiFetch<unknown>('/auth/local/register', {
    method: 'POST',
    body: { username, email, password },
  }).then(normalizeAuthPayload)
}

export function fetchMe(token: string) {
  return apiFetch<unknown>('/users/me', { token }).then(normalizeUser)
}

export function updateMe(
  token: string,
  payload: Pick<UserProfile, 'username' | 'description'>,
) {
  return apiFetch<unknown>('/users-permissions/users/me', {
    method: 'PUT',
    token,
    body: payload,
  }).then(normalizeUser)
}

export function fetchPosts(token: string, limit = 30) {
  return apiFetch<unknown>('/posts', { token, query: postsQuery(limit) }).then(
    normalizePosts,
  )
}

export function createPost(token: string, text: string, authorId: number) {
  return apiFetch<unknown>('/posts', {
    method: 'POST',
    token,
    body: { data: { text, author: authorId } },
  }).then(normalizePost)
}

export function updatePostLike(
  token: string,
  postId: number,
  like: number,
  likedUserIds: number[],
) {
  return apiFetch<unknown>(`/posts/${postId}`, {
    method: 'PUT',
    token,
    body: { data: { like, users_likes: likedUserIds } },
  }).then(normalizePost)
}

export function deletePost(token: string, postId: number) {
  return apiFetch<unknown>(`/posts/${postId}`, {
    method: 'DELETE',
    token,
  })
}

export function fetchUser(token: string, userId: number) {
  return apiFetch<unknown>(`/users/${userId}`, { token }).then(normalizeUser)
}

export function fetchUsers(token: string) {
  return apiFetch<unknown>('/users', { token }).then(normalizeUsers)
}

export function fetchPostsByAuthor(token: string, authorId: number) {
  const query = postsQuery(30)
  query.set('filters[author][id][$eq]', String(authorId))

  return apiFetch<unknown>('/posts', { token, query }).then(normalizePosts)
}
