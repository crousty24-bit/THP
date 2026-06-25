import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { createPost, deletePost, fetchPosts, updatePostLike } from '@/api/client'
import { PostComposer } from '@/components/PostComposer'
import { PostList } from '@/components/PostList'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import type { Post } from '@/types'

export function HomePage() {
  const dispatch = useAppDispatch()
  const { jwt, user } = useAppSelector((state) => state.auth)
  const { items, status, error, pendingIds } = useAppSelector((state) => state.posts)
  const [isComposing, setIsComposing] = useState(false)

  const loadPosts = useCallback(async () => {
    if (!jwt) {
      return
    }

    dispatch({ type: 'POSTS_REQUEST' })

    try {
      const posts = await fetchPosts(jwt)
      dispatch({ type: 'POSTS_SUCCESS', payload: posts })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to load posts. Check that Shmeeter is running.'
      dispatch({ type: 'POSTS_FAILURE', payload: message })
    }
  }, [dispatch, jwt])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  async function handleCreatePost(text: string) {
    if (!jwt || !user) {
      return
    }

    setIsComposing(true)

    try {
      const post = await createPost(jwt, text, user.id)
      dispatch({ type: 'POSTS_UPSERT', payload: post })
      await loadPosts()
      toast.success('Post published.')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to publish this post.'
      toast.error(message)
    } finally {
      setIsComposing(false)
    }
  }

  async function handleToggleLike(post: Post) {
    if (!jwt || !user || pendingIds.includes(post.id)) {
      return
    }

    const hasLiked = post.likedUserIds.includes(user.id)
    const likedUserIds = hasLiked
      ? post.likedUserIds.filter((id) => id !== user.id)
      : [...post.likedUserIds, user.id]
    const like = hasLiked ? Math.max(0, post.like - 1) : post.like + 1

    dispatch({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: true } })

    try {
      const updatedPost = await updatePostLike(jwt, post.id, like, likedUserIds)
      dispatch({
        type: 'POSTS_UPSERT',
        payload: {
          ...updatedPost,
          author: updatedPost.author || post.author,
          like,
          likedUserIds:
            updatedPost.likedUserIds.length > 0 ? updatedPost.likedUserIds : likedUserIds,
        },
      })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to update like.'
      toast.error(message)
    } finally {
      dispatch({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: false } })
    }
  }

  async function handleDeletePost(post: Post) {
    if (!jwt || !user || post.author?.id !== user.id || pendingIds.includes(post.id)) {
      return
    }

    dispatch({ type: 'POSTS_SET_PENDING', payload: { id: post.id, pending: true } })

    try {
      await deletePost(jwt, post.id)
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

  if (!jwt || !user) {
    return (
      <section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-2xl flex-col justify-center gap-8 px-5 py-12 text-center">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-primary" translate="no">
            Zgen
          </p>
          <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
            Welcome On My Social Network
          </h1>
          <p className="text-pretty text-lg leading-8 text-muted-foreground">
            This website is a training to React, global state handling and tokens.
            Here, authentification and routing will be used to create a small
            social media website.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/register">Create Account</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="timeline-title">
      <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-3 border-b border-border/80 bg-background/88 px-4 backdrop-blur-md">
        <div>
          <h1 id="timeline-title" className="text-xl font-semibold tracking-tight">
            Home
          </h1>
          <p className="text-sm text-muted-foreground">Latest posts from Zgen</p>
        </div>
        <Button variant="ghost" size="icon" onClick={loadPosts} aria-label="Refresh posts">
          <RefreshCw aria-hidden="true" />
        </Button>
      </header>

      <PostComposer isSubmitting={isComposing} onSubmit={handleCreatePost} />

      {error ? (
        <div className="border-b border-border/80 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <PostList
        posts={items}
        currentUserId={user.id}
        pendingIds={pendingIds}
        status={status}
        emptyMessage="No posts yet. Publish the first one."
        onToggleLike={handleToggleLike}
        onDelete={handleDeletePost}
      />
    </section>
  )
}
