'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { loginAction, type LoginState } from '@/lib/auth-actions'

const initialState: LoginState = { error: null }
const inputClassName =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="identifier" className="text-sm font-medium">
          Username atau email
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          maxLength={100}
          className={inputClassName}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
          className={inputClassName}
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Memproses...' : 'Masuk'}
      </Button>
    </form>
  )
}
