import { useCallback, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { deletePost, fetchPostsByAuthor, fetchUser, fetchUsers, updatePostLike } from '@/api/client'
import { PostList } from '@/components/PostList'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import type { Post, RequestStatus, UserProfile } from '@/types'

type LocationState = {
  authorId?: number
}

export function UserPage() {
  const dispatch = useAppDispatch()
  const { username = '' } = useParams()
  const location = useLocation()
  const state = location.state as LocationState | null
  const { jwt, user: currentUser } = useAppSelector((storeState) => storeState.auth)
  const pendingIds = useAppSelector((storeState) => storeState.posts.pendingIds)
  const [author, setAuthor] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const loadAuthor = useCallback(async () => {
    if (!jwt) {
      return
    }

    setStatus('loading')
    setError(null)

    try {
      let resolvedAuthor: UserProfile | null = null

      if (state?.authorId) {
        resolvedAuthor = await fetchUser(jwt, state.authorId)
      } else {
        const users = await fetchUsers(jwt)
        resolvedAuthor =
          users.find((candidate) => candidate.username === decodeURIComponent(username)) ||
          null
      }

      if (!resolvedAuthor) {
        throw new Error('User not found.')
      }

      const authorPosts = await fetchPostsByAuthor(jwt, resolvedAuthor.id)
      setAuthor(resolvedAuthor)
      setPosts(authorPosts)
      setStatus('success')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to load this profile.'
      setError(message)
      setStatus('error')
    }
  }, [jwt, state?.authorId, username])

  useEffect(() => {
    void loadAuthor()
  }, [loadAuthor])

  async function handleToggleLike(post: Post) {
    if (!jwt || !currentUser || pendingIds.includes(post.id)) {
      return
    }

    const hasLiked = post.likedUserIds.includes(currentUser.id)
    const likedUserIds = hasLiked
      ? post.likedUserIds.filter((id) => id !== currentUser.id)
      : [...post.likedUserIds, currentUser.id]
    const like = hasLiked ? Math.max(0, post.like - 1) : post.like + 1

    dispatch({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: true } })

    try {
      const updatedPost = await updatePostLike(jwt, post.id, like, likedUserIds)
      setPosts((currentPosts) =>
        currentPosts.map((candidate) =>
          candidate.id === updatedPost.id ? updatedPost : candidate,
        ),
      )
      dispatch({ type: 'POSTS_UPSERT', payload: updatedPost })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to update like.'
      toast.error(message)
    } finally {
      dispatch({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: false } })
    }
  }

  async function handleDelete(post: Post) {
    if (!jwt || !currentUser || post.author?.id !== currentUser.id) {
      return
    }

    dispatch({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: true } })

    try {
      await deletePost(jwt, post.id)
      setPosts((currentPosts) => currentPosts.filter((candidate) => candidate.id !== post.id))
      dispatch({ type: 'POSTS_REMOVE', payload: post.id })
      toast.success('Post deleted.')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to delete post.'
      toast.error(message)
    } finally {
      dispatch({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: false } })
    }
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
        currentUserId={currentUser?.id || 0}
        pendingIds={pendingIds}
        status={status}
        emptyMessage="This author has not posted yet."
        onToggleLike={handleToggleLike}
        onDelete={handleDelete}
      />
    </section>
  )
}
