import { authReducer } from '@/store/authReducer'
import { postsReducer } from '@/store/postsReducer'

import type { AuthAction } from '@/store/authReducer'
import type { PostsAction } from '@/store/postsReducer'
import type { AuthState, PostsState } from '@/types'

export type RootState = {
  auth: AuthState
  posts: PostsState
}

export type RootAction =
  | AuthAction
  | PostsAction
  | {
      type: string
      payload?: unknown
    }

export function rootReducer(state: RootState | undefined, action: RootAction): RootState {
  return {
    auth: authReducer(state?.auth, action as AuthAction),
    posts: postsReducer(state?.posts, action as PostsAction),
  }
}
