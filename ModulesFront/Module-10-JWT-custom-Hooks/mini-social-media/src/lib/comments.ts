import type { LocalComment, UserProfile } from '@/types'

export const POST_CHARACTER_LIMIT = 120
export const COMMENT_CHARACTER_LIMIT = 100

type CreateLocalCommentInput = {
  postId: number
  parentId: string | null
  text: string
  author: UserProfile
}

function createCommentId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function createLocalComment({
  postId,
  parentId,
  text,
  author,
}: CreateLocalCommentInput): LocalComment {
  const now = new Date().toISOString()

  return {
    id: createCommentId(),
    postId,
    parentId,
    text,
    like: 0,
    createdAt: now,
    updatedAt: now,
    author: {
      id: author.id,
      username: author.username,
      description: author.description ?? null,
    },
    likedUserIds: [],
  }
}

export function getPostComments(comments: LocalComment[], postId: number) {
  return comments.filter((comment) => comment.postId === postId)
}

export function getTotalCommentCount(comments: LocalComment[]) {
  return comments.length
}

export function getTopLevelComments(comments: LocalComment[]) {
  return comments
    .filter((comment) => !comment.parentId)
    .toSorted((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
}

export function getReplies(comments: LocalComment[], parentId: string) {
  return comments
    .filter((comment) => comment.parentId === parentId)
    .toSorted((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt))
}

export function getFeaturedComment(comments: LocalComment[]) {
  const topLevelComments = getTopLevelComments(comments)

  return (
    topLevelComments.toSorted((left, right) => {
      if (right.like !== left.like) {
        return right.like - left.like
      }

      return Date.parse(right.createdAt) - Date.parse(left.createdAt)
    })[0] || null
  )
}
