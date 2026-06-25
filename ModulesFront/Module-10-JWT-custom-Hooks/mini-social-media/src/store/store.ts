import { createStore } from 'redux'

import { rootReducer } from '@/store/rootReducer'

import type { RootState } from '@/store/rootReducer'
import type { AuthState } from '@/types'

export const AUTH_STORAGE_KEY = 'zgen-auth-state'

function getInitialState() {
  return rootReducer(undefined, { type: '@@INIT' })
}

function normalizeStoredAuth(value: unknown): AuthState {
  const emptyAuth = getInitialState().auth

  if (!value || typeof value !== 'object') {
    return emptyAuth
  }

  const record = value as Partial<AuthState>

  if (!record.jwt || !record.user?.id || !record.user.username) {
    return emptyAuth
  }

  return {
    jwt: String(record.jwt),
    user: record.user,
    status: 'success',
    error: null,
  }
}

function loadPersistedState() {
  try {
    const rawState = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (!rawState) {
      return getInitialState()
    }

    return {
      ...getInitialState(),
      auth: normalizeStoredAuth(JSON.parse(rawState)),
    }
  } catch {
    return getInitialState()
  }
}

export const store = createStore(rootReducer, loadPersistedState())

store.subscribe(() => {
  const { auth } = store.getState()

  try {
    if (!auth.jwt || !auth.user) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        jwt: auth.jwt,
        user: auth.user,
      }),
    )
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
})

export type AppDispatch = typeof store.dispatch
export type { RootState }
