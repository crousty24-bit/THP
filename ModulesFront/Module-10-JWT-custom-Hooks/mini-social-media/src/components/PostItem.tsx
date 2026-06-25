import { Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
import { formatRelativeDate } from '@/lib/date'

import type { Post } from '@/types'

type PostItemProps = {
  post: Post
  currentUserId: number
  isPending: boolean
  onToggleLike: (post: Post) => Promise<void>
  onDelete: (post: Post) => Promise<void>
}

function getAuthorName(post: Post) {
  return post.author?.username || 'Unknown user'
}

function getFallback(username: string) {
  return username.slice(0, 2).toUpperCase()
}

export function PostItem({
  post,
  currentUserId,
  isPending,
  onToggleLike,
  onDelete,
}: PostItemProps) {
  const authorName = getAuthorName(post)
  const isOwnPost = post.author?.id === currentUserId
  const hasLiked = post.likedUserIds.includes(currentUserId)
  const authorPath = `/user/${encodeURIComponent(authorName)}`

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

        <p className="mt-2 whitespace-pre-wrap break-words text-[0.98rem] leading-7 text-foreground">
          {post.text}
        </p>

        <footer className="mt-3 flex items-center justify-between gap-3">
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

          {isOwnPost ? (
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
          ) : null}
        </footer>
      </div>
    </article>
  )
}
