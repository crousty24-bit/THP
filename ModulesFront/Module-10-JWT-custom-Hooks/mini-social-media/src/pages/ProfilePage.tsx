import { Save } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'

import { updateMe } from '@/api/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const formRef = useRef<HTMLFormElement>(null)
  const { jwt, user } = useAppSelector((state) => state.auth)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  if (!jwt || !user) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!jwt) {
      return
    }

    setError(null)
    setIsSaving(true)

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') || '').trim()
    const description = String(formData.get('description') || '').trim()

    try {
      const updatedUser = await updateMe(jwt, { username, description })
      dispatch({ type: 'AUTH_USER_UPDATED', payload: updatedUser })
      toast.success('Profile updated.')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to update profile.'
      setError(message)
      formRef.current?.querySelector<HTMLInputElement>('#profile-username')?.focus()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section aria-labelledby="profile-title">
      <header className="border-b border-border/80 p-4">
        <h1 id="profile-title" className="text-xl font-semibold tracking-tight">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">View and edit your account.</p>
      </header>

      <div className="flex flex-col gap-5 p-4">
        <Card className="border-border/80 bg-card/60 shadow-none">
          <CardHeader className="flex-row items-center gap-4">
            <Avatar className="size-16 border border-border">
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate">{user.username}</CardTitle>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
              {user.description || 'No description yet.'}
            </p>
          </CardContent>
        </Card>

        <form ref={formRef} className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="profile-username">Username</FieldLabel>
              <Input
                id="profile-username"
                name="username"
                type="text"
                autoComplete="username"
                spellCheck={false}
                required
                defaultValue={user.username}
                aria-invalid={Boolean(error)}
                placeholder="Your username…"
              />
            </Field>

            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="profile-description">Description</FieldLabel>
              <Textarea
                id="profile-description"
                name="description"
                autoComplete="off"
                defaultValue={user.description || ''}
                rows={5}
                aria-invalid={Boolean(error)}
                placeholder="Tell people what you are building…"
              />
              {error ? <FieldError>{error}</FieldError> : null}
            </Field>
          </FieldGroup>

          <Button type="submit" disabled={isSaving}>
            <Save data-icon="inline-start" aria-hidden="true" />
            {isSaving ? 'Saving…' : 'Save Profile'}
          </Button>
        </form>
      </div>
    </section>
  )
}
