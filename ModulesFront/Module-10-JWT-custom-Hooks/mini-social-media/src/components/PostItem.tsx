import { Heart, MessageCircle, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PostComments } from '@/components/PostComments'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { POST_CHARACTER_LIMIT } from '@/lib/comments'
import { formatRelativeDate } from '@/lib/date'

import type { LocalComment, Post, UserProfile } from '@/types'

type PostItemProps = {
  post: Post
  currentUser: UserProfile
  comments: LocalComment[]
  isPending: boolean
  commentsInitiallyOpen?: boolean
  disablePostLink?: boolean
  onToggleLike: (post: Post) => Promise<void>
  onEdit: (post: Post, text: string) => Promise<boolean>
  onDelete: (post: Post) => Promise<void>
  onCreateComment: (postId: number, text: string, parentId: string | null) => void
  onToggleCommentLike: (comment: LocalComment) => void
  onUpdateComment: (comment: LocalComment, text: string) => void
  onDeleteComment: (comment: LocalComment) => void
}

function getAuthorName(post: Post) {
  return post.author?.username || 'Unknown user'
}

function getFallback(username: string) {
  return username.slice(0, 2).toUpperCase()
}

export function PostItem({
  post,
  currentUser,
  comments,
  isPending,
  commentsInitiallyOpen = false,
  disablePostLink = false,
  onToggleLike,
  onEdit,
  onDelete,
  onCreateComment,
  onToggleCommentLike,
  onUpdateComment,
  onDeleteComment,
}: PostItemProps) {
  const [areCommentsOpen, setAreCommentsOpen] = useState(commentsInitiallyOpen)
  const [commentFocusSignal, setCommentFocusSignal] = useState(0)
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [postText, setPostText] = useState(post.text)
  const authorName = getAuthorName(post)
  const currentUserId = currentUser.id
  const isOwnPost = post.author?.id === currentUserId
  const hasLiked = post.likedUserIds.includes(currentUserId)
  const authorPath = `/user/${encodeURIComponent(authorName)}`
  const postPath = `/post/${post.id}`
  const totalCommentCount = comments.length
  const trimmedPostText = postText.trim()

  function openComments(focusComposer: boolean) {
    setAreCommentsOpen(true)

    if (focusComposer) {
      setCommentFocusSignal((current) => current + 1)
    }
  }

  async function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!trimmedPostText || isPending) {
      return
    }

    const didUpdate = await onEdit(post, trimmedPostText)

    if (didUpdate) {
      setIsEditingPost(false)
    }
  }

  return (
    <article className="flex min-w-0 gap-3 border-b border-border/80 p-4">
      <Avatar className="size-10 border border-border">
        <AvatarFallback>{getFallback(authorName)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <header className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {post.author ? (
            <Link
              className="min-w-0 rounded-md font-semibold text-foreground underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              to={authorPath}
              state={{ authorId: post.author.id }}
            >
              <span className="block truncate">{authorName}</span>
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{authorName}</span>
          )}
          <span className="text-sm text-muted-foreground" aria-hidden="true">
            ·
          </span>
          <time className="text-sm text-muted-foreground" dateTime={post.createdAt}>
            {formatRelativeDate(post.createdAt)}
          </time>
        </header>

        {isEditingPost ? (
          <form className="mt-3 flex flex-col gap-3" onSubmit={handleEditSubmit}>
            <Textarea
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
              maxLength={POST_CHARACTER_LIMIT}
              rows={3}
              className="resize-none border-border/70 bg-muted/20 text-base shadow-none focus-visible:ring-2"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs tabular-nums text-muted-foreground">
                {POST_CHARACTER_LIMIT - postText.length} characters left
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPostText(post.text)
                    setIsEditingPost(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={!trimmedPostText || isPending}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        ) : disablePostLink ? (
          <p className="mt-2 whitespace-pre-wrap break-words text-[0.98rem] leading-7 text-foreground">
            {post.text}
          </p>
        ) : (
          <Link
            className="mt-2 block rounded-md whitespace-pre-wrap break-words text-[0.98rem] leading-7 text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            to={postPath}
          >
            {post.text}
          </Link>
        )}

        <footer className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => onToggleLike(post)}
              aria-pressed={hasLiked}
              aria-label={hasLiked ? 'Unlike post' : 'Like post'}
              className={hasLiked ? 'text-accent hover:text-accent' : undefined}
            >
              <Heart aria-hidden="true" data-icon="inline-start" />
              <span className="tabular-nums">
                {post.like} {post.like === 1 ? 'like' : 'likes'}
              </span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openComments(true)}
              aria-expanded={areCommentsOpen}
              aria-label="Open comments"
            >
              <MessageCircle aria-hidden="true" data-icon="inline-start" />
              <span className="tabular-nums">
                {totalCommentCount}{' '}
                {totalCommentCount === 1 ? 'comment' : 'comments'}
              </span>
            </Button>
          </div>

          {isOwnPost ? (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={isPending}
                aria-label="Edit post"
                onClick={() => setIsEditingPost(true)}
              >
                <Pencil aria-hidden="true" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={isPending}
                    aria-label="Delete post"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action removes your post from the timeline. It cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => {
                        void onDelete(post)
                      }}
                    >
                      Delete Post
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null}
        </footer>

        {areCommentsOpen ? (
          <PostComments
            postId={post.id}
            comments={comments}
            currentUser={currentUser}
            mode="expanded"
            focusSignal={commentFocusSignal}
            onCreateComment={onCreateComment}
            onToggleCommentLike={onToggleCommentLike}
            onUpdateComment={onUpdateComment}
            onDeleteComment={onDeleteComment}
          />
        ) : (
          <PostComments
            postId={post.id}
            comments={comments}
            currentUser={currentUser}
            mode="preview"
            onExpand={() => openComments(false)}
            onCreateComment={onCreateComment}
            onToggleCommentLike={onToggleCommentLike}
            onUpdateComment={onUpdateComment}
            onDeleteComment={onDeleteComment}
          />
        )}
      </div>
    </article>
  )
}
