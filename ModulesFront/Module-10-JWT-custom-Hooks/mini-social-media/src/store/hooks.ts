import { useAtomValue, useSetAtom } from 'jotai'

import { authAtom, commentsAtom, postsAtom, pwaInstallAtom } from '@/store/atoms'

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

export function useCommentsState() {
  return useAtomValue(commentsAtom)
}

export function useCommentsDispatch() {
  return useSetAtom(commentsAtom)
}

export function usePwaInstallState() {
  return useAtomValue(pwaInstallAtom)
}

export function usePwaInstallDispatch() {
  return useSetAtom(pwaInstallAtom)
}
