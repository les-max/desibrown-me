'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl mb-2 text-foreground">Welcome back</h1>
        <p className="text-muted text-sm mb-8">Sign in to your account.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-sm">
              {error}
            </p>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoFocus
            className="w-full px-4 py-3 border border-border rounded-sm bg-surface text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-base"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-border rounded-sm bg-surface text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-foreground text-background rounded-sm text-sm hover:bg-accent transition-colors disabled:opacity-40"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
