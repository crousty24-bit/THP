import { Send } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { COMMENT_CHARACTER_LIMIT } from '@/lib/comments'

type CommentComposerProps = {
  label: string
  placeholder: string
  submitLabel: string
  focusSignal?: number
  onSubmit: (text: string) => void | Promise<void>
}

export function CommentComposer({
  label,
  placeholder,
  submitLabel,
  focusSignal = 0,
  onSubmit,
}: CommentComposerProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textareaId = useId()
  const trimmedText = text.trim()

  useEffect(() => {
    if (focusSignal > 0) {
      textareaRef.current?.focus()
    }
  }, [focusSignal])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!trimmedText) {
      return
    }

    await onSubmit(trimmedText)
    setText('')
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={textareaId}>
        {label}
      </label>
      <Textarea
        ref={textareaRef}
        id={textareaId}
        name="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        maxLength={COMMENT_CHARACTER_LIMIT}
        rows={2}
        className="min-h-20 resize-none border-border/70 bg-muted/20 text-sm shadow-none focus-visible:ring-2"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
          {COMMENT_CHARACTER_LIMIT - text.length} characters left
        </p>
        <Button type="submit" size="sm" disabled={!trimmedText}>
          <Send data-icon="inline-start" aria-hidden="true" />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
