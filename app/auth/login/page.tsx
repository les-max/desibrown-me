'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError('Something went wrong. Please try again.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl mb-2 text-foreground">Welcome back</h1>
        <p className="text-muted text-sm mb-8">
          Enter your email and we&apos;ll send you a link to sign in.
        </p>

        {sent ? (
          <div className="border border-border rounded-sm p-6 bg-surface text-center">
            <p className="text-sm text-foreground">
              Check your email — a magic link is on its way.
            </p>
            <p className="text-xs text-muted mt-2">You can close this tab.</p>
          </div>
        ) : (
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
              placeholder="your@email.com"
              required
              autoFocus
              className="w-full px-4 py-3 border border-border rounded-sm bg-surface text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-base"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-foreground text-background rounded-sm text-sm hover:bg-accent transition-colors disabled:opacity-40"
            >
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
