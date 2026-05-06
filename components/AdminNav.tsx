'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminNav() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="border-b border-border">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/admin"
          className="font-serif text-xl text-foreground hover:text-accent transition-colors"
        >
          Admin
        </Link>
        <button
          onClick={handleSignOut}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
