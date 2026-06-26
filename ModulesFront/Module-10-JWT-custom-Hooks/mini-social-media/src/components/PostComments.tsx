import { Heart, MessageCircle, MoreHorizontal, Reply } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CommentComposer } from '@/components/CommentComposer'
import { Textarea } from '@/components/ui/textarea'
import { formatRelativeDate } from '@/lib/date'
import {
  COMMENT_CHARACTER_LIMIT,
  getFeaturedComment,
  getReplies,
  getTopLevelComments,
  getTotalCommentCount,
} from '@/lib/comments'

import type { LocalComment, UserProfile } from '@/types'

type PostCommentsProps = {
  postId: number
  comments: LocalComment[]
  currentUser: UserProfile
  mode: 'preview' | 'expanded'
  focusSignal?: number
  onExpand?: () => void
  onCreateComment: (postId: number, text: string, parentId: string | null) => void
  onToggleCommentLike: (comment: LocalComment) => void
  onUpdateComment: (comment: LocalComment, text: string) => void
  onDeleteComment: (comment: LocalComment) => void
}

type CommentRowProps = {
  comment: LocalComment
  replies: LocalComment[]
  currentUserId: number
  canReply: boolean
  onCreateReply: (text: string) => void
  onToggleCommentLike: (comment: LocalComment) => void
  onUpdateComment: (comment: LocalComment, text: string) => void
  onDeleteComment: (comment: LocalComment) => void
}

function getFallback(username: string) {
  return username.slice(0, 2).toUpperCase()
}

function CommentRow({
  comment,
  replies,
  currentUserId,
  canReply,
  onCreateReply,
  onToggleCommentLike,
  onUpdateComment,
  onDeleteComment,
}: CommentRowProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)
  const hasLiked = comment.likedUserIds.includes(currentUserId)
  const isOwnComment = comment.author.id === currentUserId
  const authorPath = `/user/${encodeURIComponent(comment.author.username)}`
  const trimmedEditText = editText.trim()

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!trimmedEditText) {
      return
    }

    onUpdateComment(comment, trimmedEditText)
    setIsEditing(false)
    setIsMenuOpen(false)
  }

  return (
    <div className="flex min-w-0 gap-3">
      <Avatar className="size-8">
        <AvatarFallback className="text-xs">
          {getFallback(comment.author.username)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="min-w-0 rounded-lg bg-muted/20 px-3 py-2">
          <header className="flex min-w-0 items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <Link
                className="min-w-0 rounded-md text-sm font-semibold text-foreground underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                to={authorPath}
                state={{ authorId: comment.author.id }}
              >
                <span className="block truncate">{comment.author.username}</span>
              </Link>
              <span className="text-xs text-muted-foreground" aria-hidden="true">
                ·
              </span>
              <time
                className="text-xs text-muted-foreground"
                dateTime={comment.createdAt}
              >
                {formatRelativeDate(comment.createdAt)}
              </time>
            </div>
            {isOwnComment ? (
              <div className="relative shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Comment options"
                  aria-expanded={isMenuOpen}
                  onClick={() => setIsMenuOpen((current) => !current)}
                >
                  <MoreHorizontal aria-hidden="true" />
                </Button>
                {isMenuOpen ? (
                  <div className="absolute right-0 top-7 z-20 flex min-w-24 flex-col rounded-lg border border-border/80 bg-popover p-1 shadow-lg">
                    <button
                      type="button"
                      className="rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted"
                      onClick={() => {
                        setIsEditing(true)
                        setIsMenuOpen(false)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-2 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteComment(comment)}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </header>
          {isEditing ? (
            <form className="mt-2 flex flex-col gap-2" onSubmit={handleEditSubmit}>
              <Textarea
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
                maxLength={COMMENT_CHARACTER_LIMIT}
                rows={2}
                className="min-h-20 resize-none border-border/70 bg-background/40 text-sm shadow-none focus-visible:ring-2"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs tabular-nums text-muted-foreground">
                  {COMMENT_CHARACTER_LIMIT - editText.length} characters left
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditText(comment.text)
                      setIsEditing(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={!trimmedEditText}>
                    Save
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
              {comment.text}
            </p>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleCommentLike(comment)}
            aria-pressed={hasLiked}
            aria-label={hasLiked ? 'Unlike comment' : 'Like comment'}
            className={hasLiked ? 'text-accent hover:text-accent' : undefined}
          >
            <Heart aria-hidden="true" data-icon="inline-start" />
            <span className="tabular-nums">{comment.like}</span>
          </Button>

          {canReply ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying((current) => !current)}
              aria-expanded={isReplying}
            >
              <Reply aria-hidden="true" data-icon="inline-start" />
              Reply
            </Button>
          ) : null}
        </div>

        {isReplying ? (
          <div className="mt-2">
            <CommentComposer
              label={`Reply to ${comment.author.username}`}
              placeholder={`Reply to ${comment.author.username}…`}
              submitLabel="Reply"
              focusSignal={1}
              onSubmit={(text) => {
                onCreateReply(text)
                setIsReplying(false)
              }}
            />
          </div>
        ) : null}

        {replies.length > 0 ? (
          <div className="mt-3 flex flex-col gap-3 pl-3">
            {replies.map((reply) => (
              <CommentRow
                key={reply.id}
                comment={reply}
                replies={[]}
                currentUserId={currentUserId}
                canReply={false}
                onCreateReply={onCreateReply}
                onToggleCommentLike={onToggleCommentLike}
                onUpdateComment={onUpdateComment}
                onDeleteComment={onDeleteComment}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function PostComments({
  postId,
  comments,
  currentUser,
  mode,
  focusSignal = 0,
  onExpand,
  onCreateComment,
  onToggleCommentLike,
  onUpdateComment,
  onDeleteComment,
}: PostCommentsProps) {
  const totalCommentCount = getTotalCommentCount(comments)

  if (mode === 'preview') {
    const featuredComment = getFeaturedComment(comments)

    if (!featuredComment) {
      return null
    }

    return (
      <div className="mt-3 flex flex-col gap-2 rounded-lg bg-muted/10 p-3">
        <CommentRow
          comment={featuredComment}
          replies={[]}
          currentUserId={currentUser.id}
          canReply={false}
          onCreateReply={() => undefined}
          onToggleCommentLike={onToggleCommentLike}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
        {totalCommentCount > 1 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={onExpand}
          >
            <MessageCircle aria-hidden="true" data-icon="inline-start" />
            Show more
          </Button>
        ) : null}
      </div>
    )
  }

  const topLevelComments = getTopLevelComments(comments)

  return (
    <section className="mt-4 flex flex-col gap-4 pt-4">
      <CommentComposer
        label="New comment"
        placeholder="Write a comment…"
        submitLabel="Comment"
        focusSignal={focusSignal}
        onSubmit={(text) => onCreateComment(postId, text, null)}
      />

      {topLevelComments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {topLevelComments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              replies={getReplies(comments, comment.id)}
              currentUserId={currentUser.id}
              canReply
              onCreateReply={(text) => onCreateComment(postId, text, comment.id)}
              onToggleCommentLike={onToggleCommentLike}
              onUpdateComment={onUpdateComment}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
          No comments yet.
        </p>
      )}
    </section>
  )
}
