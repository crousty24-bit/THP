import { useAtomValue, useSetAtom } from 'jotai'

import { authAtom, postsAtom } from '@/store/atoms'

export function useAuthState() {
  return useAtomValue(authAtom)
}

export function useAuthDispatch() {
  return useSetAtom(authAtom)
}

export function usePostsState() {
  return useAtomValue(postsAtom)
}

export function usePostsDispatch() {
  return useSetAtom(postsAtom)
}
