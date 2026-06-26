import { atom } from 'jotai'
import { atomWithReducer } from 'jotai/utils'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

import { authReducer, initialAuthState } from '@/store/authReducer'
import { commentsReducer, initialCommentsState } from '@/store/commentsReducer'
import { initialPostsState, postsReducer } from '@/store/postsReducer'
import { initialPwaInstallState, pwaInstallReducer } from '@/store/pwaInstallReducer'

import type { CommentsAction } from '@/store/commentsReducer'
import type { LocalComment } from '@/types'

const commentsStorageAtom = atomWithStorage<LocalComment[]>(
  'zgen:comments:v1',
  initialCommentsState.items,
  createJSONStorage(() => localStorage),
  { getOnInit: true },
)

export const authAtom = atomWithReducer(initialAuthState, authReducer)
export const postsAtom = atomWithReducer(initialPostsState, postsReducer)
export const pwaInstallAtom = atomWithReducer(initialPwaInstallState, pwaInstallReducer)
export const commentsAtom = atom(
  (get) => ({ items: get(commentsStorageAtom) }),
  (get, set, action: CommentsAction) => {
    const nextState = commentsReducer({ items: get(commentsStorageAtom) }, action)

    set(commentsStorageAtom, nextState.items)
  },
)
