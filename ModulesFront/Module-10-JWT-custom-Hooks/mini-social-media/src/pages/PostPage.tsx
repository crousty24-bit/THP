import { ArrowLeft } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { deletePost, fetchPost, updatePostLike, updatePostText } from '@/api/client'
import { PostItem } from '@/components/PostItem'
import { Button } from '@/components/ui/button'
import { createLocalComment, getPostComments } from '@/lib/comments'
import {
  useAuthState,
  useCommentsDispatch,
  useCommentsState,
  usePostsDispatch,
  usePostsState,
} from '@/store/hooks'

import type { LocalComment, Post, RequestStatus } from '@/types'

export function PostPage() {
  const navigate = useNavigate()
  const { postId: postIdParam = '' } = useParams()
  const postId = Number(postIdParam)
  const dispatchPosts = usePostsDispatch()
  const dispatchComments = useCommentsDispatch()
  const { accessToken, user } = useAuthState()
  const { items, pendingIds } = usePostsState()
  const comments = useCommentsState().items
  const [post, setPost] = useState<Post | null>(
    () => items.find((candidate) => candidate.id === postId) || null,
  )
  const [status, setStatus] = useState<RequestStatus>(post ? 'success' : 'idle')
  const [error, setError] = useState<string | null>(null)

  const loadPost = useCallback(async () => {
    if (!accessToken || !Number.isFinite(postId) || postId <= 0) {
      setStatus('error')
      setError('Post not found.')
      return
    }

    setStatus((currentStatus) => (currentStatus === 'success' ? currentStatus : 'loading'))
    setError(null)

    try {
      const fetchedPost = await fetchPost(accessToken, postId)
      setPost(fetchedPost)
      dispatchPosts({ type: 'POSTS_UPSERT', payload: fetchedPost })
      setStatus('success')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to load this post.'
      setError(message)
      setStatus('error')
    }
  }, [accessToken, dispatchPosts, postId])

  useEffect(() => {
    const cachedPost = items.find((candidate) => candidate.id === postId) || null

    if (cachedPost) {
      setPost(cachedPost)
      setStatus('success')
    }
  }, [items, postId])

  useEffect(() => {
    void loadPost()
  }, [loadPost])

  if (!accessToken || !user) {
    return null
  }

  const currentUser = user

  async function handleToggleLike(targetPost: Post) {
    if (!accessToken || pendingIds.includes(targetPost.id)) {
      return
    }

    const hasLiked = targetPost.likedUserIds.includes(currentUser.id)
    const likedUserIds = hasLiked
      ? targetPost.likedUserIds.filter((id) => id !== currentUser.id)
      : [...targetPost.likedUserIds, currentUser.id]
    const like = hasLiked ? Math.max(0, targetPost.like - 1) : targetPost.like + 1

    dispatchPosts({
      type: 'POSTS_SET_PENDING',
      payload: { id: targetPost.id, pending: true },
    })

    try {
      const updatedPost = await updatePostLike(
        accessToken,
        targetPost.id,
        like,
        likedUserIds,
      )
      const mergedPost = {
        ...updatedPost,
        author: updatedPost.author || targetPost.author,
        like,
        likedUserIds:
          updatedPost.likedUserIds.length > 0 ? updatedPost.likedUserIds : likedUserIds,
      }

      setPost(mergedPost)
      dispatchPosts({ type: 'POSTS_UPSERT', payload: mergedPost })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to update like.'
      toast.error(message)
    } finally {
      dispatchPosts({
        type: 'POSTS_SET_PENDING',
        payload: { id: targetPost.id, pending: false },
      })
    }
  }

  async function handleDeletePost(targetPost: Post) {
    if (!accessToken || targetPost.author?.id !== currentUser.id) {
      return
    }

    dispatchPosts({
      type: 'POSTS_SET_PENDING',
      payload: { id: targetPost.id, pending: true },
    })

    try {
      await deletePost(accessToken, targetPost.id)
      dispatchPosts({ type: 'POSTS_REMOVE', payload: targetPost.id })
      dispatchComments({ type: 'COMMENTS_REMOVE_FOR_POST', payload: targetPost.id })
      toast.success('Post deleted.')
      navigate('/', { replace: true })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to delete post.'
      toast.error(message)
    } finally {
      dispatchPosts({
        type: 'POSTS_SET_PENDING',
        payload: { id: targetPost.id, pending: false },
      })
    }
  }

  async function handleEditPost(targetPost: Post, text: string) {
    if (
      !accessToken ||
      targetPost.author?.id !== currentUser.id ||
      pendingIds.includes(targetPost.id)
    ) {
      return false
    }

    dispatchPosts({
      type: 'POSTS_SET_PENDING',
      payload: { id: targetPost.id, pending: true },
    })

    try {
      const updatedPost = await updatePostText(accessToken, targetPost.id, text)
      const mergedPost = {
        ...updatedPost,
        author: updatedPost.author || targetPost.author,
        text,
        modified: true,
        like: updatedPost.like || targetPost.like,
        likedUserIds:
          updatedPost.likedUserIds.length > 0
            ? updatedPost.likedUserIds
            : targetPost.likedUserIds,
      }

      setPost(mergedPost)
      dispatchPosts({ type: 'POSTS_UPSERT', payload: mergedPost })
      toast.success('Post updated.')
      return true
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to update post.'
      toast.error(message)
      return false
    } finally {
      dispatchPosts({
        type: 'POSTS_SET_PENDING',
        payload: { id: targetPost.id, pending: false },
      })
    }
  }

  function handleCreateComment(targetPostId: number, text: string, parentId: string | null) {
    dispatchComments({
      type: 'COMMENTS_ADD',
      payload: createLocalComment({
        postId: targetPostId,
        parentId,
        text,
        author: currentUser,
      }),
    })
  }

  function handleToggleCommentLike(comment: LocalComment) {
    dispatchComments({
      type: 'COMMENTS_TOGGLE_LIKE',
      payload: { commentId: comment.id, userId: currentUser.id },
    })
  }

  function handleUpdateComment(comment: LocalComment, text: string) {
    if (comment.author.id !== currentUser.id) {
      return
    }

    dispatchComments({
      type: 'COMMENTS_UPDATE',
      payload: { commentId: comment.id, text },
    })
  }

  function handleDeleteComment(comment: LocalComment) {
    if (comment.author.id !== currentUser.id) {
      return
    }

    dispatchComments({ type: 'COMMENTS_REMOVE', payload: comment.id })
  }

  return (
    <section aria-labelledby="post-title">
      <header className="sticky top-0 z-10 flex min-h-16 items-center gap-3 border-b border-border/80 bg-background/88 px-4 backdrop-blur-md">
        <Button asChild variant="ghost" size="icon" aria-label="Back to Home">
          <Link to="/">
            <ArrowLeft aria-hidden="true" />
          </Link>
        </Button>
        <div>
          <h1 id="post-title" className="text-xl font-semibold tracking-tight">
            Post
          </h1>
          <p className="text-sm text-muted-foreground">Post and replies</p>
        </div>
      </header>

      {error ? (
        <div className="border-b border-border/80 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {status === 'loading' && !post ? (
        <div className="border-b border-border/80 p-8 text-sm text-muted-foreground">
          Loading post…
        </div>
      ) : null}

      {post ? (
        <PostItem
          post={post}
          currentUser={currentUser}
          comments={getPostComments(comments, post.id)}
          isPending={pendingIds.includes(post.id)}
          commentsInitiallyOpen
          disablePostLink
          onToggleLike={handleToggleLike}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onCreateComment={handleCreateComment}
          onToggleCommentLike={handleToggleCommentLike}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
        />
      ) : null}
    </section>
  )
}
