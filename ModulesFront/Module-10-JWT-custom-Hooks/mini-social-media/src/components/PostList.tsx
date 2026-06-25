import { Skeleton } from '@/components/ui/skeleton'
import { PostItem } from '@/components/PostItem'

import type { Post } from '@/types'

type PostListProps = {
  posts: Post[]
  currentUserId: number
  pendingIds: number[]
  status: 'idle' | 'loading' | 'success' | 'error'
  emptyMessage: string
  onToggleLike: (post: Post) => Promise<void>
  onDelete: (post: Post) => Promise<void>
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-0" aria-label="Loading posts">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-3 border-b border-border/80 p-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PostList({
  posts,
  currentUserId,
  pendingIds,
  status,
  emptyMessage,
  onToggleLike,
  onDelete,
}: PostListProps) {
  if (status === 'loading' && posts.length === 0) {
    return <FeedSkeleton />
  }

  if (posts.length === 0) {
    return (
      <div className="border-b border-border/80 p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="content-auto">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          isPending={pendingIds.includes(post.id)}
          onToggleLike={onToggleLike}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
