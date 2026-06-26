import { Send } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { POST_CHARACTER_LIMIT } from '@/lib/comments'

type PostComposerProps = {
  isSubmitting: boolean
  onSubmit: (text: string) => Promise<void>
}

export function PostComposer({ isSubmitting, onSubmit }: PostComposerProps) {
  const [text, setText] = useState('')
  const trimmedText = text.trim()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!trimmedText || isSubmitting) {
      return
    }

    await onSubmit(trimmedText)
    setText('')
  }

  return (
    <form
      className="flex flex-col gap-3 border-b border-border/80 p-4"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="post-text">
        New post
      </label>
      <Textarea
        id="post-text"
        name="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What’s happening?…"
        maxLength={POST_CHARACTER_LIMIT}
        rows={3}
        className="resize-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
          {POST_CHARACTER_LIMIT - text.length} characters left
        </p>
        <Button type="submit" disabled={!trimmedText || isSubmitting}>
          <Send data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? 'Posting…' : 'Post'}
        </Button>
      </div>
    </form>
  )
}
