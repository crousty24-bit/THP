import { useCallback, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import {
  deletePost,
  fetchPostsByAuthor,
  fetchUser,
  fetchUsers,
  updatePostLike,
  updatePostText,
} from '@/api/client'
import { PostList } from '@/components/PostList'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createLocalComment } from '@/lib/comments'
import {
  useAuthState,
  useCommentsDispatch,
  useCommentsState,
  usePostsDispatch,
  usePostsState,
} from '@/store/hooks'

import type { LocalComment, Post, RequestStatus, UserProfile } from '@/types'

type LocationState = {
  authorId?: number
}

export function UserPage() {
  const dispatchPosts = usePostsDispatch()
  const dispatchComments = useCommentsDispatch()
  const { username = '' } = useParams()
  const location = useLocation()
  const state = location.state as LocationState | null
  const { accessToken, user: currentUser } = useAuthState()
  const pendingIds = usePostsState().pendingIds
  const comments = useCommentsState().items
  const [author, setAuthor] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const loadAuthor = useCallback(async () => {
    if (!accessToken) {
      return
    }

    setStatus('loading')
    setError(null)

    try {
      let resolvedAuthor: UserProfile | null = null

      if (state?.authorId) {
        resolvedAuthor = await fetchUser(accessToken, state.authorId)
      } else {
        const users = await fetchUsers(accessToken)
        resolvedAuthor =
          users.find((candidate) => candidate.username === decodeURIComponent(username)) ||
          null
      }

      if (!resolvedAuthor) {
        throw new Error('User not found.')
      }

      const authorPosts = await fetchPostsByAuthor(accessToken, resolvedAuthor.id)
      setAuthor(resolvedAuthor)
      setPosts(authorPosts)
      setStatus('success')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to load this profile.'
      setError(message)
      setStatus('error')
    }
  }, [accessToken, state?.authorId, username])

  useEffect(() => {
    void loadAuthor()
  }, [loadAuthor])

  async function handleToggleLike(post: Post) {
    if (!accessToken || !currentUser || pendingIds.includes(post.id)) {
      return
    }

    const hasLiked = post.likedUserIds.includes(currentUser.id)
    const likedUserIds = hasLiked
      ? post.likedUserIds.filter((id) => id !== currentUser.id)
      : [...post.likedUserIds, currentUser.id]
    const like = hasLiked ? Math.max(0, post.like - 1) : post.like + 1

    dispatchPosts({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: true } })

    try {
      const updatedPost = await updatePostLike(accessToken, post.id, like, likedUserIds)
      const mergedPost = {
        ...updatedPost,
        author: updatedPost.author || post.author,
        like,
        likedUserIds:
          updatedPost.likedUserIds.length > 0 ? updatedPost.likedUserIds : likedUserIds,
      }

      setPosts((currentPosts) =>
        currentPosts.map((candidate) =>
          candidate.id === mergedPost.id ? mergedPost : candidate,
        ),
      )
      dispatchPosts({ type: 'POSTS_UPSERT', payload: mergedPost })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to update like.'
      toast.error(message)
    } finally {
      dispatchPosts({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: false } })
    }
  }

  async function handleDelete(post: Post) {
    if (!accessToken || !currentUser || post.author?.id !== currentUser.id) {
      return
    }

    dispatchPosts({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: true } })

    try {
      await deletePost(accessToken, post.id)
      setPosts((currentPosts) => currentPosts.filter((candidate) => candidate.id !== post.id))
      dispatchPosts({ type: 'POSTS_REMOVE', payload: post.id })
      dispatchComments({ type: 'COMMENTS_REMOVE_FOR_POST', payload: post.id })
      toast.success('Post deleted.')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to delete post.'
      toast.error(message)
    } finally {
      dispatchPosts({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: false } })
    }
  }

  async function handleEditPost(post: Post, text: string) {
    if (
      !accessToken ||
      !currentUser ||
      post.author?.id !== currentUser.id ||
      pendingIds.includes(post.id)
    ) {
      return false
    }

    dispatchPosts({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: true } })

    try {
      const updatedPost = await updatePostText(accessToken, post.id, text)
      const mergedPost = {
        ...updatedPost,
        author: updatedPost.author || post.author,
        text,
        modified: true,
        like: updatedPost.like || post.like,
        likedUserIds:
          updatedPost.likedUserIds.length > 0
            ? updatedPost.likedUserIds
            : post.likedUserIds,
      }

      setPosts((currentPosts) =>
        currentPosts.map((candidate) =>
          candidate.id === mergedPost.id ? mergedPost : candidate,
        ),
      )
      dispatchPosts({ type: 'POSTS_UPSERT', payload: mergedPost })
      toast.success('Post updated.')
      return true
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to update post.'
      toast.error(message)
      return false
    } finally {
      dispatchPosts({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: false } })
    }
  }

  function handleCreateComment(postId: number, text: string, parentId: string | null) {
    if (!currentUser) {
      return
    }

    dispatchComments({
      type: 'COMMENTS_ADD',
      payload: createLocalComment({ postId, parentId, text, author: currentUser }),
    })
  }

  function handleToggleCommentLike(comment: LocalComment) {
    if (!currentUser) {
      return
    }

    dispatchComments({
      type: 'COMMENTS_TOGGLE_LIKE',
      payload: { commentId: comment.id, userId: currentUser.id },
    })
  }

  function handleUpdateComment(comment: LocalComment, text: string) {
    if (!currentUser || comment.author.id !== currentUser.id) {
      return
    }

    dispatchComments({
      type: 'COMMENTS_UPDATE',
      payload: { commentId: comment.id, text },
    })
  }

  function handleDeleteComment(comment: LocalComment) {
    if (!currentUser || comment.author.id !== currentUser.id) {
      return
    }

    dispatchComments({ type: 'COMMENTS_REMOVE', payload: comment.id })
  }

  return (
    <section aria-labelledby="user-title">
      <header className="border-b border-border/80 p-4">
        <h1 id="user-title" className="text-xl font-semibold tracking-tight">
          Author Profile
        </h1>
        <p className="text-sm text-muted-foreground">Posts and profile details.</p>
      </header>

      {author ? (
        <div className="flex gap-4 border-b border-border/80 p-4">
          <Avatar className="size-16 border border-border">
            <AvatarFallback>{author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-semibold">{author.username}</h2>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
              {author.description || 'No description yet.'}
            </p>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="border-b border-border/80 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <PostList
        posts={posts}
        currentUser={currentUser || { id: 0, username: 'Unknown user' }}
        comments={comments}
        pendingIds={pendingIds}
        status={status}
        emptyMessage="This author has not posted yet."
        onToggleLike={handleToggleLike}
        onEdit={handleEditPost}
        onDelete={handleDelete}
        onCreateComment={handleCreateComment}
        onToggleCommentLike={handleToggleCommentLike}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />
    </section>
  )
}
