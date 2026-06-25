import type { Post, PostsState } from '@/types'

export type PostsAction =
  | { type: 'POSTS_REQUEST' }
  | { type: 'POSTS_SUCCESS'; payload: Post[] }
  | { type: 'POSTS_FAILURE'; payload: string }
  | { type: 'POSTS_UPSERT'; payload: Post }
  | { type: 'POSTS_REMOVE'; payload: number }
  | { type: 'POSTS_SET_PENDING'; payload: { id: number; pending: boolean } }
  | { type: 'POSTS_CLEAR' }

export const initialPostsState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
  pendingIds: [],
}

function sortPosts(posts: Post[]) {
  return posts.toSorted((left, right) => {
    return Date.parse(right.createdAt) - Date.parse(left.createdAt)
  })
}

export function postsReducer(
  state = initialPostsState,
  action: PostsAction,
): PostsState {
  switch (action.type) {
    case 'POSTS_REQUEST':
      return { ...state, status: 'loading', error: null }
    case 'POSTS_SUCCESS':
      return {
        ...state,
        items: sortPosts(action.payload),
        status: 'success',
        error: null,
      }
    case 'POSTS_FAILURE':
      return { ...state, status: 'error', error: action.payload }
    case 'POSTS_UPSERT': {
      const otherPosts = state.items.filter((post) => post.id !== action.payload.id)

      return {
        ...state,
        items: sortPosts([action.payload, ...otherPosts]),
        status: 'success',
        error: null,
      }
    }
    case 'POSTS_REMOVE':
      return {
        ...state,
        items: state.items.filter((post) => post.id !== action.payload),
      }
    case 'POSTS_SET_PENDING':
      return {
        ...state,
        pendingIds: action.payload.pending
          ? [...new Set([...state.pendingIds, action.payload.id])]
          : state.pendingIds.filter((id) => id !== action.payload.id),
      }
    case 'POSTS_CLEAR':
      return initialPostsState
    default:
      return state
  }
}
