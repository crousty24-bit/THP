import { atomWithReducer } from 'jotai/utils'

import { authReducer, initialAuthState } from '@/store/authReducer'
import { initialPostsState, postsReducer } from '@/store/postsReducer'

export const authAtom = atomWithReducer(initialAuthState, authReducer)
export const postsAtom = atomWithReducer(initialPostsState, postsReducer)
