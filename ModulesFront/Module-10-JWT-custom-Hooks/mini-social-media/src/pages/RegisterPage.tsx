import { UserPlus } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { API_DISABLED_MESSAGE, isApiEnabled, register } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const { accessToken, status } = useAppSelector((state) => state.auth)

  if (accessToken) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isApiEnabled) {
      setError(API_DISABLED_MESSAGE)
      return
    }

    setError(null)
    dispatch({ type: 'AUTH_REQUEST' })

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')

    try {
      const payload = await register(username, email, password)
      dispatch({ type: 'AUTH_SUCCESS', payload })
      toast.success('Your account is ready.')
      navigate('/', { replace: true })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Registration failed. Check the form and try again.'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      setError(message)
      firstFieldRef.current?.focus()
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-md flex-col justify-center gap-8 px-4 py-10">
      <div className="flex flex-col gap-3 text-center">
        <p className="text-sm font-medium text-primary">Join Zgen</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight">
          Create Your Account
        </h1>
        <p className="text-pretty text-muted-foreground">
          Register once and Zgen connects you automatically.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {!isApiEnabled ? (
          <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-sm text-muted-foreground">
            {API_DISABLED_MESSAGE}
          </div>
        ) : null}
        <FieldGroup>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              ref={firstFieldRef}
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              spellCheck={false}
              required
              minLength={2}
              aria-invalid={Boolean(error)}
              placeholder="zgen_user…"
            />
          </Field>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              required
              aria-invalid={Boolean(error)}
              placeholder="you@example.com…"
            />
          </Field>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              aria-invalid={Boolean(error)}
              placeholder="At least 6 characters…"
            />
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
        </FieldGroup>

        <Button type="submit" size="lg" disabled={!isApiEnabled || status === 'loading'}>
          <UserPlus data-icon="inline-start" aria-hidden="true" />
          {status === 'loading' ? 'Creating Account…' : 'Create Account'}
        </Button>
      </form>

      <FieldDescription className="text-center">
        Already registered?{' '}
        <Link
          className="text-primary underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          to="/login"
        >
          Login
        </Link>
      </FieldDescription>
    </section>
  )
}
