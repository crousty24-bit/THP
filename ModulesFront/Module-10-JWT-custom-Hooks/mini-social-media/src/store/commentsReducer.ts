import type { CommentsState, LocalComment } from '@/types'

export type CommentsAction =
  | { type: 'COMMENTS_ADD'; payload: LocalComment }
  | { type: 'COMMENTS_UPDATE'; payload: { commentId: string; text: string } }
  | { type: 'COMMENTS_TOGGLE_LIKE'; payload: { commentId: string; userId: number } }
  | { type: 'COMMENTS_REMOVE'; payload: string }
  | { type: 'COMMENTS_REMOVE_FOR_POST'; payload: number }
  | { type: 'COMMENTS_CLEAR' }

export const initialCommentsState: CommentsState = {
  items: [],
}

function sortComments(comments: LocalComment[]) {
  return comments.toSorted((left, right) => {
    return Date.parse(right.createdAt) - Date.parse(left.createdAt)
  })
}

export function commentsReducer(
  state = initialCommentsState,
  action: CommentsAction,
): CommentsState {
  switch (action.type) {
    case 'COMMENTS_ADD':
      return {
        ...state,
        items: sortComments([action.payload, ...state.items]),
      }
    case 'COMMENTS_UPDATE':
      return {
        ...state,
        items: state.items.map((comment) =>
          comment.id === action.payload.commentId
            ? {
                ...comment,
                text: action.payload.text,
                updatedAt: new Date().toISOString(),
              }
            : comment,
        ),
      }
    case 'COMMENTS_TOGGLE_LIKE':
      return {
        ...state,
        items: state.items.map((comment) => {
          if (comment.id !== action.payload.commentId) {
            return comment
          }

          const hasLiked = comment.likedUserIds.includes(action.payload.userId)
          const likedUserIds = hasLiked
            ? comment.likedUserIds.filter((id) => id !== action.payload.userId)
            : [...comment.likedUserIds, action.payload.userId]

          return {
            ...comment,
            like: hasLiked ? Math.max(0, comment.like - 1) : comment.like + 1,
            likedUserIds,
            updatedAt: new Date().toISOString(),
          }
        }),
      }
    case 'COMMENTS_REMOVE':
      return {
        ...state,
        items: state.items.filter(
          (comment) =>
            comment.id !== action.payload && comment.parentId !== action.payload,
        ),
      }
    case 'COMMENTS_REMOVE_FOR_POST':
      return {
        ...state,
        items: state.items.filter((comment) => comment.postId !== action.payload),
      }
    case 'COMMENTS_CLEAR':
      return initialCommentsState
    default:
      return state
  }
}
