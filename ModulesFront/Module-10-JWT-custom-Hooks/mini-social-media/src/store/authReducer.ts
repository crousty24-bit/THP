import type { AuthPayload, AuthState, UserProfile } from '@/types'

export type AuthAction =
  | { type: 'AUTH_REQUEST' }
  | { type: 'AUTH_SUCCESS'; payload: AuthPayload }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_USER_UPDATED'; payload: UserProfile }
  | { type: 'AUTH_LOGOUT' }

export const initialAuthState: AuthState = {
  jwt: null,
  user: null,
  status: 'idle',
  error: null,
}

export function authReducer(
  state = initialAuthState,
  action: AuthAction,
): AuthState {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { ...state, status: 'loading', error: null }
    case 'AUTH_SUCCESS':
      return {
        jwt: action.payload.jwt,
        user: action.payload.user,
        status: 'success',
        error: null,
      }
    case 'AUTH_FAILURE':
      return { ...state, status: 'error', error: action.payload }
    case 'AUTH_USER_UPDATED':
      return { ...state, user: action.payload, status: 'success', error: null }
    case 'AUTH_LOGOUT':
      return initialAuthState
    default:
      return state
  }
}
